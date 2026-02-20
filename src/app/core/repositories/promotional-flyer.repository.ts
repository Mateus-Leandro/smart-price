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
import { EnumFilterPromotionalFlyerProducts, EnumWarningProductType } from '../enums/product.enum';
import { EnumSupplierDeliveryTypeEnum } from '../enums/supplier.enum';

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
    flyerId?: number,
  ): Observable<{ data: IPromotionalFlyerView[]; count: number }> {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;

    let query = this.supabase
      .from('promotional_flyers_with_counts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (flyerId) {
      query = query.eq('id', flyerId);
    }

    this.loadingService.show();

    return from(query.range(fromIdx, toIdx)).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const mappedData: IPromotionalFlyerView[] = (data || []).map((item: any) => ({
          id: item.id,
          idIntegral: item.id_integral,
          branche: {
            id: item.branche_id,
            name: item.branche_name,
          },
          name: item.name,
          finished: item.finished,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          totalProducts: item.total_products ?? 0,
          importedProducts: item.imported_products ?? 0,
        }));

        return { data: mappedData, count: count ?? 0 };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }
  getProducts(
    flyerId: number,
    idIntegral: number,
    paginator: IDefaultPaginatorDataSource<IPromotionalFlyerProductsView>,
    search?: string,
    selectedFilterType?: EnumFilterPromotionalFlyerProducts,
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
      quantity_suppliers,
      current_sale_price,
      current_loyalty_price,
      erp_import_date,
      lock_price,
      price_discount_percent,
      warning_type,

      promotionalFlyer:promotional_flyers!inner (
        branche_id,
        id_integral
      ),

      product:products!inner (
        id,
        id_text,
        name,

        productMarginBranches:product_margin_branches (
          margin,
          branche_id
        ),

        competitorPrices:competitor_price_flyer_products (
          price,
          integral_flyer_id,
          competitor:competitors (
            id,
            name
          )
        )
      ),

      supplier:suppliers!inner (
        id,
        name,
        delivery_type
      )
      `,
        { count: 'exact' },
      )
      .eq('promotional_flyer_id', flyerId)
      .eq('product.competitorPrices.integral_flyer_id', idIntegral)
      .order('product(name)', { ascending: true });

    if (search) {
      query = query.or(`name.ilike.%${search}%,id_text.ilike.%${search}%`, {
        foreignTable: 'products',
      });
    }

    if (selectedFilterType) {
      switch (selectedFilterType) {
        case EnumFilterPromotionalFlyerProducts.NoSalePrice:
          query = query.is('sale_price', null);
          break;

        case EnumFilterPromotionalFlyerProducts.NoLoyaltyPrice:
          query = query.is('loyalty_price', null);
          break;

        case EnumFilterPromotionalFlyerProducts.NoImported:
          query = query.is('erp_import_date', null);
          break;

        case EnumFilterPromotionalFlyerProducts.CompetitorMargin:
          query = query.eq('warning_type', EnumFilterPromotionalFlyerProducts.CompetitorMargin);
          break;

        case EnumFilterPromotionalFlyerProducts.CompetitorPrice:
          query = query.eq('warning_type', EnumFilterPromotionalFlyerProducts.CompetitorPrice);
          break;

        case EnumFilterPromotionalFlyerProducts.NoCompetingPrice:
          query = query.is('product.competitorPrices', null);
          break;

        case EnumFilterPromotionalFlyerProducts.SupplierDeliveryFree:
          query = query.eq('supplier.delivery_type', EnumSupplierDeliveryTypeEnum.PORTA);
          break;

        case EnumFilterPromotionalFlyerProducts.SupplierDeliveryPaid:
          query = query.eq('supplier.delivery_type', EnumSupplierDeliveryTypeEnum.BH);
          break;
      }
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
            quantitySuppliers: item.quantity_suppliers || 0,
            currentSalePrice: item.current_sale_price,
            currentLoyaltyPrice: item.current_loyalty_price,
            erpImportDate: item.erp_import_date,
            lockPrice: item.lock_price,
            priceDiscountPercent: item.price_discount_percent,
            warningType: item.warning_type,
            product: {
              id: item?.product?.id,
              name: item?.product?.name,
              margin: correctMargin?.margin,
            },
            supplier: {
              id: item?.supplier?.id,
              name: item?.supplier?.name,
              deliveryType: item?.supplier?.delivery_type,
            },
            competitorPrices: item?.product?.competitorPrices || [],
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

  lockOrUnlockPrices(flyerId: number, productId: number, lock: boolean) {
    return from(
      this.supabase
        .from('promotional_flyer_products')
        .update({
          lock_price: lock,
        })
        .eq('promotional_flyer_id', flyerId)
        .eq('product_id', productId),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  updatePriceDiscountPercent(
    flyerId: number,
    productId: number,
    discountPercent: number,
  ): Observable<void> {
    const promise = this.supabase
      .from('promotional_flyer_products')
      .update({
        price_discount_percent: discountPercent,
      })
      .eq('promotional_flyer_id', flyerId)
      .eq('product_id', productId);

    return from(promise).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  updateWarningType(
    flyerId: number,
    productId: number,
    warningType?: EnumWarningProductType,
  ): Observable<void> {
    const promise = this.supabase
      .from('promotional_flyer_products')
      .update({
        warning_type: warningType ?? null,
      })
      .eq('promotional_flyer_id', flyerId)
      .eq('product_id', productId);

    return from(promise).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }
}
