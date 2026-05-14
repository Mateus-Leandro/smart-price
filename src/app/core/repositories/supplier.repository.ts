import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import { finalize, forkJoin, from, map, Observable, of, switchMap } from 'rxjs';
import { EnumSupplierDeliveryTypeEnum } from 'src/app/core/enums/supplier.enum';
import {
  ISupplierProductBranchView,
  ISupplierProductPivotView,
  ISupplierView,
  IUpdateSupplier,
} from '../models/supplier.model';

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
    paginator: IDefaultPaginatorDataSource<ISupplierProductPivotView>,
    search?: string,
  ): Observable<{
    data: ISupplierProductPivotView[];
    count: number;
    branches: { brancheId: number; brancheName: string }[];
  }> {
    this.loadingService.show();

    // Queries 1 e 2 são independentes — rodam em paralelo
    return forkJoin({
      branches: from(this.supabase.from('company_branches').select('id, name').order('id')),
      flyers: from(this.supabase.from('supplier_flyers').select('id').eq('supplier_id', supplierId)),
    }).pipe(
      switchMap(({ branches, flyers }) => {
        if (branches.error) throw branches.error;
        if (flyers.error) throw flyers.error;

        const sortedBranches = (branches.data ?? []).map((b: any) => ({
          brancheId: b.id as number,
          brancheName: b.name as string,
        }));
        const flyerIds = (flyers.data ?? []).map((f: any) => f.id as number);

        if (!sortedBranches.length || !flyerIds.length)
          return of({ data: [], count: 0, branches: sortedBranches });

        // Query 3: IDs únicos de produtos nos encartes deste fornecedor
        return from(
          this.supabase
            .from('supplier_flyer_products')
            .select('product_id')
            .in('supplier_flyer_id', flyerIds),
        ).pipe(
          switchMap(({ data: flyerProducts, error: fpError }) => {
            if (fpError) throw fpError;
            if (!flyerProducts?.length) return of({ data: [], count: 0, branches: sortedBranches });

            const uniqueProductIds = [
              ...new Set(flyerProducts.map((fp: any) => fp.product_id as number)),
            ];
            const fromIdx = paginator.pageIndex * paginator.pageSize;
            const toIdx = fromIdx + paginator.pageSize - 1;

            let query = this.supabase
              .from('products')
              .select('id, name, marginBranches:product_margin_branches(margin, branche_id)', {
                count: 'exact',
              })
              .in('id', uniqueProductIds)
              .order('name', { ascending: true });

            if (search) query = query.ilike('name', `%${search}%`);

            // Query 4: produtos paginados com suas margens
            return from(query.range(fromIdx, toIdx)).pipe(
              map(({ data, count, error }) => {
                if (error) throw error;

                const mappedData: ISupplierProductPivotView[] = (data ?? []).map((item: any) => ({
                  productId: item.id,
                  productName: item.name,
                  branches: sortedBranches.map((branch): ISupplierProductBranchView => ({
                    brancheId: branch.brancheId,
                    brancheName: branch.brancheName,
                    margin:
                      item.marginBranches?.find((m: any) => m.branche_id === branch.brancheId)
                        ?.margin ?? null,
                  })),
                }));

                return { data: mappedData, count: count ?? 0, branches: sortedBranches };
              }),
            );
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
