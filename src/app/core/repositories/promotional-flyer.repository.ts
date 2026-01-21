import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { finalize, from, map, Observable, switchMap } from 'rxjs';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import {
  IPromotionalFlyerProductsView,
  IPromotionalFlyerView,
} from 'src/app/features/promotional-flyer/models/flyer-view.model';
import { LoadingService } from '../services/loading.service';
import { ProductPriceType } from 'src/app/features/promotional-flyer/enums/product-price-type.enum';

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
        id, name, finished, created_at, updated_at, 
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
        quote_cost,
        current_cost_price, 
        current_sale_price,
        current_loyalty_price,
        erp_import_date,
        product:products!inner (id, name),
        supplier:suppliers!inner (id, name)
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

        const mappedData: IPromotionalFlyerProductsView[] = (data || []).map((item: any) => ({
          salePrice: item.sale_price,
          loyaltyPrice: item.loyalty_price,
          quoteCost: item.quote_cost,
          currentCostPrice: item.current_cost_price,
          currentSalePrice: item.current_sale_price,
          currentLoyaltyPrice: item.current_loyalty_price,
          erpImportDate: item.erp_import_date,
          product: { id: item?.product?.id, name: item?.product?.name },
          supplier: { id: item?.supplier?.id, name: item?.supplier?.name },
        })) as IPromotionalFlyerProductsView[];

        return { data: mappedData, count: count ?? 0 };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  updateProductPrice(
    flyerId: number,
    productId: number,
    price: number,
    productPriceType: ProductPriceType,
  ): Observable<void> {
    const columnName =
      productPriceType === ProductPriceType.SalePrice ? 'sale_price' : 'loyalty_price';

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
}
