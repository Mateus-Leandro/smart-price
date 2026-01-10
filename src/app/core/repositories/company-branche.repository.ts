import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import { finalize, from, map } from 'rxjs';
import { ICompanyBrancheView } from 'src/app/features/company-branche/models/company-branch-view.model';

@Injectable({ providedIn: 'root' })
export class CompanyBrancheRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  loadCompanyBranches(
    paginator: IDefaultPaginatorDataSource<ICompanyBrancheView>,
    search?: string,
  ) {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;

    let query = this.supabase
      .from('company_branches')
      .select(
        `
      id,
      cnpj,
      name,
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

        const mappedData: ICompanyBrancheView[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          cnpj: item.cnpj,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        return { data: mappedData, count: count ?? 0 };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }
}
