import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { ISupplierFlyerView } from '../models/supplier-flyer.model';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import { finalize, from, map, Observable } from 'rxjs';

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
  ): Observable<{ data: ISupplierFlyerView[]; count: number }> {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;

    let query = this.supabase
      .from('supplier_flyers')
      .select(
        `
        id,
        name,
        company_id,
        branche_id,
        supplier_id,
        created_at,
        updated_at,
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
      query = query.ilike('name', `%${search}%`);
    }

    this.loadingService.show();
    return from(query.range(fromIdx, toIdx)).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const mappedData: ISupplierFlyerView[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          branche: item.branche,
          supplier: item.supplier,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        return { data: mappedData, count: count ?? 0 };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }
}
