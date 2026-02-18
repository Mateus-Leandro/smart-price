import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { finalize, from, map } from 'rxjs';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import { ICompetitor, IUpdateCompetitor } from '../models/competitor';

@Injectable({ providedIn: 'root' })
export class CompetitorRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  createCompetitor(competitorName: string) {
    this.loadingService.show();
    return from(
      this.supabase
        .from('competitors')
        .insert({
          name: competitorName,
        })
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  updateCompetitor(updateCompetitor: IUpdateCompetitor) {
    this.loadingService.show();
    return from(
      this.supabase
        .from('competitors')
        .update({
          name: updateCompetitor.name,
        })
        .eq('id', updateCompetitor.id)
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  loadCompetitors(
    paginator: IDefaultPaginatorDataSource<ICompetitor>,
    branchId?: number,
    search?: string,
  ) {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;

    let query = this.supabase
      .from('competitors')
      .select(
        `
      id, 
      name, 
      created_at, 
      updated_at,
      competitor_branches!inner (
        branche_id,
        company_id
      )
      `,
        { count: 'exact' },
      )
      .order('name', { ascending: true });

    if (branchId) {
      query = query.eq('competitor_branches.branche_id', branchId);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    this.loadingService.show();
    return from(query.range(fromIdx, toIdx)).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const mappedData: ICompetitor[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        return { data: mappedData, count: count ?? 0 };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  getCompetitorInfoById(competitorId: number) {
    this.loadingService.show();
    return from(
      this.supabase
        .from('competitors')
        .select(
          `
      id, 
      name, 
      created_at, 
      updated_at
      `,
        )
        .eq('id', competitorId)
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        return data;
      }),
      finalize(() => this.loadingService.hide()),
    );
  }
}
