import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { finalize, from, map, Observable } from 'rxjs';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import { LoadingService } from '../services/loading.service';
import {
  IPromotionalFlyerProductsView,
  IPromotionalFlyerView,
} from '../models/promotional-flyer.model';

@Injectable({ providedIn: 'root' })
export class PromotionalFlyerRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  getFlyers(
    paginator: IDefaultPaginatorDataSource<IPromotionalFlyerView>,
    search?: string,
  ): Observable<{ data: IPromotionalFlyerView[]; count: number }> {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;

    let query = this.supabase
      .from('promotional_flyers')
      .select(
        `
        id, id_integral, branche_id, name, finished, created_at, updated_at, 
        promotional_flyer_products(count)
      `,
        { count: 'exact' },
      )
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    this.loadingService.show();
    return from(query.range(fromIdx, toIdx)).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const mappedData: IPromotionalFlyerView[] = (data || []).map((item: any) => ({
          id: item.id,
          idIntegral: item.id_integral,
          brancheId: item.branche_id,
          name: item.name,
          finished: item.finished,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          totalProducts: item.promotional_flyer_products?.[0]?.count ?? 0,
        }));

        return { data: mappedData, count: count ?? 0 };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  getProducts(
    flyerId: number,
    paginator: IDefaultPaginatorDataSource<IPromotionalFlyerProductsView>,
    search?: string,
  ): Observable<{ data: IPromotionalFlyerProductsView[]; count: number }> {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;

    let query = this.supabase
      .from('promotional_flyer_products')
      .select(
        `
    sale_price,
    loyalty_price,
    shipping_price,
    quote_cost,
    average_cost_quote,
    current_sale_price,
    current_loyalty_price,
    erp_import_date,

    promotionalFlyer:promotional_flyers!inner (
     branche_id
    ),

    product:products!inner (
      id,
      name,
      productMarginBranches:product_margin_branches (
      margin,
      branche_id
      )
    ),

    supplier:suppliers!inner (
      id,
      name
    ),

    competitorPrices:competitor_price_flyer_products (
      price,

      competitor:competitors (
        id,
        name
      )
    )
    `,
        { count: 'exact' },
      )
      .eq('promotional_flyer_id', flyerId)
      .order('product(name)', { ascending: true });

    if (search) {
      query = query.ilike('product.name', `%${search}%`);
    }

    this.loadingService.show();
    return from(query.range(fromIdx, toIdx)).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const mappedData: IPromotionalFlyerProductsView[] = (data || []).map((item: any) => {
          const targetBranchId = item.promotionalFlyer?.branche_id;
          const correctMargin = item.product?.productMarginBranches?.find(
            (m: any) => m.branche_id === targetBranchId,
          );

          return {
            salePrice: item.sale_price,
            loyaltyPrice: item.loyalty_price,
            shippingPrice: item.shipping_price,
            quoteCost: item.quote_cost,
            averageCostQuote: item.average_cost_quote,
            currentSalePrice: item.current_sale_price,
            currentLoyaltyPrice: item.current_loyalty_price,
            erpImportDate: item.erp_import_date,
            product: {
              id: item?.product?.id,
              name: item?.product?.name,
              margin: correctMargin?.margin,
            },
            supplier: { id: item?.supplier?.id, name: item?.supplier?.name },
            competitorPrices: item?.competitorPrices,
          };
        }) as IPromotionalFlyerProductsView[];

        return { data: mappedData, count: count ?? 0 };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  updateProductPrice(
    flyerId: number,
    productId: number,
    price: number,
    columnName: string,
  ): Observable<void> {
    const updateData = {
      [columnName]: price,
      updated_at: new Date().toISOString(),
    };

    const promise = this.supabase
      .from('promotional_flyer_products')
      .update(updateData)
      .eq('promotional_flyer_id', flyerId)
      .eq('product_id', productId);

    return from(promise).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  sendPricesToErp(flyerId: number, productId?: number): Observable<void> {
    let query = this.supabase
      .from('promotional_flyer_products')
      .update({
        send_to_erp: true,
        updated_at: new Date(),
      })
      .eq('promotional_flyer_id', flyerId)
      .gt('sale_price', 0);

    if (productId) {
      query = query.eq('product_id', productId);
    }

    return from(query).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  applySuggestedPrices(flyerId: number) {
    this.loadingService.show();
    return from(this.supabase.rpc('apply_suggested_prices', { p_flyer_id: flyerId })).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      finalize(() => this.loadingService.hide()),
    );
  }
}
