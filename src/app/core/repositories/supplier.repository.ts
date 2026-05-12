import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import { finalize, from, map, Observable, of, switchMap } from 'rxjs';
import { EnumSupplierDeliveryTypeEnum } from 'src/app/core/enums/supplier.enum';
import { ISupplierProductView, ISupplierView, IUpdateSupplier } from '../models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  getSuppliers(
    paginator: IDefaultPaginatorDataSource<ISupplierView>,
    deliveryType: null | EnumSupplierDeliveryTypeEnum | 'EMPTY',
    search?: string,
  ): Observable<{ data: ISupplierView[]; count: number }> {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;

    let query = this.supabase
      .from('suppliers')
      .select(
        `
        id,
        name,
        cnpj,
        delivery_type,
        created_at,
        updated_at
        `,
        { count: 'exact' },
      )
      .order('name', { ascending: true });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (deliveryType) {
      if (deliveryType === 'EMPTY') {
        query = query.is('delivery_type', null);
      } else {
        query = query.eq('delivery_type', deliveryType);
      }
    }

    this.loadingService.show();
    return from(query.range(fromIdx, toIdx)).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const mappedData: ISupplierView[] = (data || []).map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            deliveryType: item.delivery_type,
            cnpj: item.cnpj,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          };
        });

        return { data: mappedData, count: count ?? 0 };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  getSupplierInfoById(supplierId: number) {
    this.loadingService.show();
    return from(
      this.supabase
        .from('suppliers')
        .select(
          `
        id,
        name,
        cnpj,
        deliveryType:delivery_type,
        createdAt:created_at,
        updatedAt:updated_at
       `,
        )
        .eq('id', supplierId)
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        return data;
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  getProductsBySupplier(
    supplierId: number,
    paginator: IDefaultPaginatorDataSource<ISupplierProductView>,
    search?: string,
  ): Observable<{ data: ISupplierProductView[]; count: number }> {
    this.loadingService.show();

    return from(
      this.supabase
        .from('supplier_flyers')
        .select('id, branche_id, branche:company_branches!inner(name)')
        .eq('supplier_id', supplierId),
    ).pipe(
      switchMap(({ data: flyers, error: flyersError }) => {
        if (flyersError) throw flyersError;
        if (!flyers || flyers.length === 0) return of({ data: [], count: 0 });

        const flyerIds = flyers.map((f: any) => f.id);
        const flyerMap = new Map<number, { brancheId: number; brancheName: string }>(
          flyers.map((f: any) => [
            f.id,
            { brancheId: f.branche_id, brancheName: f.branche?.name || '' },
          ]),
        );

        const fromIdx = paginator.pageIndex * paginator.pageSize;
        const toIdx = fromIdx + paginator.pageSize - 1;

        let query = this.supabase
          .from('supplier_flyer_products')
          .select(
            `
            supplier_flyer_id,
            product:products!inner (
              id,
              name,
              marginBranches:product_margin_branches (
                margin,
                branche_id
              )
            )
            `,
            { count: 'exact' },
          )
          .in('supplier_flyer_id', flyerIds)
          .order('product(name)', { ascending: true });

        if (search) {
          query = query.or(`name.ilike.%${search}%,id_text.ilike.%${search}%`, {
            foreignTable: 'product',
          });
        }

        return from(query.range(fromIdx, toIdx)).pipe(
          map(({ data, count, error }) => {
            if (error) throw error;

            const mappedData: ISupplierProductView[] = (data || []).map((item: any) => {
              const flyerInfo = flyerMap.get(item.supplier_flyer_id);
              const brancheId = flyerInfo?.brancheId ?? 0;
              const brancheName = flyerInfo?.brancheName ?? '';
              const margin =
                item.product?.marginBranches?.find((m: any) => m.branche_id === brancheId)
                  ?.margin ?? null;

              return {
                productId: item.product.id,
                productName: item.product.name,
                brancheId,
                brancheName,
                margin,
              };
            });

            return { data: mappedData, count: count ?? 0 };
          }),
        );
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  updateSupplier(supplierUpdate: IUpdateSupplier) {
    this.loadingService.show();
    return from(
      this.supabase
        .from('suppliers')
        .update({
          delivery_type: supplierUpdate.deliveryType,
        })
        .eq('id', supplierUpdate.supplierId)
        .select()
        .single(),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      finalize(() => this.loadingService.hide()),
    );
  }
}
