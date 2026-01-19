import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import { finalize, from, map, Observable } from 'rxjs';
import { ISupplierView } from 'src/app/features/supplier/model/supplier-view.model';
import { IUpdateSupplier } from 'src/app/features/supplier/model/supplier-update.model';

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
        created_at,
        updated_at
        `,
        { count: 'exact' },
      )
      .order('name', { ascending: true });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    this.loadingService.show();
    return from(query.range(fromIdx, toIdx)).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const mappedData: ISupplierView[] = (data || []).map((item: any) => {
          return {
            id: item.id,
            name: item.name,
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
