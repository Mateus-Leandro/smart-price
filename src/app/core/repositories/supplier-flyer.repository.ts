import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { ISupplierFlyerProductsView, ISupplierFlyerView } from '../models/supplier-flyer.model';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import { finalize, forkJoin, from, map, Observable, of } from 'rxjs';
import { EnumWarningProductType } from '../enums/product.enum';
import {
  EnumFilterPromotionalFlyerProducts,
  EnumFilterSupplierFlyerProducts,
} from '../enums/flyer.enum';

@Injectable({ providedIn: 'root' })
export class SupplierFlyerRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  loadSupplierFlyers(
    paginator: IDefaultPaginatorDataSource<ISupplierFlyerView>,
    search?: string,
    id?: number,
  ): Observable<{ data: ISupplierFlyerView[]; count: number }> {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;

    let query = this.supabase
      .from('supplier_flyers_with_counts')
      .select(
        `
      *,
      supplier:suppliers!inner (
         id,
         cnpj,
         name
      ),
      branche:company_branches!inner (
         id,
         name
      )
      `,
        { count: 'exact' },
      )
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('search_text', `%${search}%`);
    }

    if (id) {
      query = query.eq('id', id);
    }

    this.loadingService.show();
    return from(query.range(fromIdx, toIdx)).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const mappedData: ISupplierFlyerView[] = (data || []).map((item: any) => ({
          id: item.id,
          idIntegral: item.id_integral,
          name: item.name,
          branche: item.branche,
          supplier: item.supplier,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          totalProducts: item.total_products,
          importedProducts: item.imported_products,
        }));

        return { data: mappedData, count: count ?? 0 };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  loadProduts(
    flyerId: number,
    idIntegral: number,
    paginator: IDefaultPaginatorDataSource<ISupplierFlyerProductsView>,
    search?: string,
    selectedFilterType?: EnumFilterSupplierFlyerProducts,
  ): Observable<{ data: ISupplierFlyerProductsView[]; count: number }> {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;

    let query = this.supabase
      .from('supplier_flyer_products_view')
      .select(
        `
          sale_price,
          send_to_erp,
          current_sale_price,
          current_loyalty_price,
          erp_import_date,
          loyalty_price,
          lock_price,
          price_discount_percent,
          previous_cost,
          cost_price,
          warning_type,
          lock_competitor_prices,
    
          supplierFlyer:supplier_flyers!inner (
            branche_id,
            id
          ),
    
          product:products!inner (
            id,
            id_text,
            name,
    
            productMarginBranches:product_margin_branches (
              margin,
              branche_id
            ),
            
            competitorPrices:competitor_price_supplier_flyer_products (
              price,
              integral_flyer_id,
              competitor:competitors (
                id,
                name
              )
            )
          )
        `,
        { count: 'exact' },
      )
      .eq('supplier_flyer_id', flyerId)
      .eq('product.competitorPrices.integral_flyer_id', idIntegral)
      .order('product(name)', { ascending: true });

    if (search) {
      query = query.or(`name.ilike.%${search}%,id_text.ilike.%${search}%`, {
        foreignTable: 'product',
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
        case EnumFilterSupplierFlyerProducts.VariationGreater:
          query = query.gt('price_variation', 0).gt('cost_price', 0).gt('previous_cost', 0);
          break;
        case EnumFilterSupplierFlyerProducts.VariationLess:
          query = query.lt('price_variation', 0);
          break;
      }
    }

    const mapResponse = ({ data, count, error }: any) => {
      if (error) throw error;

      const mappedData: ISupplierFlyerProductsView[] = (data || []).map((item: any) => {
        const targetBranchId = item.supplierFlyer?.branche_id;

        const correctMargin = item.product?.productMarginBranches?.find(
          (m: any) => m.branche_id === targetBranchId,
        );

        return {
          product: {
            id: item?.product?.id,
            name: item?.product?.name,
            margin: correctMargin?.margin,
          },
          sendToErp: item.send_to_erp,
          costPrice: item.cost_price,
          salePrice: item.sale_price,
          previousCost: item.previous_cost,
          loyaltyPrice: item.loyalty_price,
          currentSalePrice: item.current_sale_price,
          currentLoyaltyPrice: item.current_loyalty_price,
          erpImportDate: item.erp_import_date,
          lockPrice: item.lock_price,
          priceDiscountPercent: item.price_discount_percent,
          warningType: item.warning_type,
          competitorPrices: item?.product?.competitorPrices || [],
          lockCompetitorPrices: item?.lock_competitor_prices || false,
        };
      });

      return { data: mappedData, count: count ?? 0 };
    };

    this.loadingService.show();

    if (selectedFilterType === EnumFilterPromotionalFlyerProducts.NoCompetitorPrice) {
      return from(query).pipe(
        map(({ data, error }) => {
          if (error) throw error;
          const withoutPrices = (data || []).filter(
            (item: any) => !item.product?.competitorPrices?.length,
          );
          return {
            data: withoutPrices.slice(fromIdx, toIdx + 1),
            count: withoutPrices.length,
            error: null,
          };
        }),
        map(mapResponse),
        finalize(() => this.loadingService.hide()),
      );
    }

    return from(query.range(fromIdx, toIdx)).pipe(
      map(mapResponse),
      finalize(() => this.loadingService.hide()),
    );
  }

  getSendToErpCounts(flyerId: number): Observable<{ sent: number; total: number }> {
    const totalQuery = this.supabase
      .from('supplier_flyer_products')
      .select('*', { count: 'exact', head: true })
      .eq('supplier_flyer_id', flyerId);

    const sentQuery = this.supabase
      .from('supplier_flyer_products')
      .select('*', { count: 'exact', head: true })
      .eq('supplier_flyer_id', flyerId)
      .eq('send_to_erp', true);

    return forkJoin({
      total: from(totalQuery),
      sent: from(sentQuery),
    }).pipe(
      map(({ total, sent }) => {
        if (total.error) throw total.error;
        if (sent.error) throw sent.error;

        return { sent: sent.count ?? 0, total: total.count ?? 0 };
      }),
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
      .from('supplier_flyer_products')
      .update(updateData)
      .eq('supplier_flyer_id', flyerId)
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
      .from('supplier_flyer_products')
      .update({
        warning_type: warningType ?? null,
      })
      .eq('supplier_flyer_id', flyerId)
      .eq('product_id', productId);

    return from(promise).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  sendPricesToErp(
    flyerId: number,
    productId?: number,
    sendToErp: boolean = true,
  ): Observable<void> {
    let query = this.supabase
      .from('supplier_flyer_products')
      .update({
        send_to_erp: sendToErp,
        updated_at: new Date(),
      })
      .eq('supplier_flyer_id', flyerId);

    if (sendToErp) {
      query = query.or('sale_price.gt.0,loyalty_price.gt.0');
    }

    if (productId) {
      query = query.eq('product_id', productId);
    }

    return from(query).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  lockOrUnlockPrices(flyerId: number, lock: boolean, productId?: number) {
    let query = this.supabase
      .from('supplier_flyer_products')
      .update({
        lock_price: lock,
      })
      .eq('supplier_flyer_id', flyerId);

    if (productId) {
      query = query.eq('product_id', productId);
    }

    return from(query).pipe(
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
      .from('supplier_flyer_products')
      .update({
        price_discount_percent: discountPercent,
      })
      .eq('supplier_flyer_id', flyerId)
      .eq('product_id', productId);

    return from(promise).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  applySuggestedPrices(flyerId: number, onlyCompetitorPriceZero: boolean = false) {
    this.loadingService.show();
    return from(
      this.supabase.rpc('apply_supplier_suggested_prices', {
        p_flyer_id: flyerId,
        p_only_zero_comp_price: onlyCompetitorPriceZero,
      }),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  clearPrices(clearValues: any, flyerId: number) {
    let updateData: any = {};

    if (clearValues.clearSalePrice) {
      updateData.sale_price = 0;
    }

    if (clearValues.clearLoyaltyPrice) {
      updateData.loyalty_price = 0;
    }

    if (Object.keys(updateData).length === 0) return of(null);

    return from(
      this.supabase
        .from('supplier_flyer_products')
        .update(updateData)
        .eq('supplier_flyer_id', flyerId),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  lockOrUnlockCompetitorPrices(flyerId: number, lockCompetitorPrices: boolean) {
    return from(
      this.supabase
        .from('supplier_flyer_products')
        .update({
          lock_competitor_prices: lockCompetitorPrices,
        })
        .eq('supplier_flyer_id', flyerId),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }
}
