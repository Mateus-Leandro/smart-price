import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { finalize, from, map } from 'rxjs';
import { ICompetitorBrancheView } from 'src/app/features/competitor-branche/models/competitor-branche-view.model';

@Injectable({ providedIn: 'root' })
export class CompetitorBrancheRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  loadCompetitorBranches(competitorId: number) {
    this.loadingService.show();
    return from(
      this.supabase
        .from('competitor_branches')
        .select(
          `
          company_branche:company_branches!inner(id, name, cnpj),
          created_at
          `,
        )
        .eq('company_branche.id', competitorId)
        .order('company_branche(name)', { ascending: true }),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        const mappedData: ICompetitorBrancheView[] = (data || []).map((item: any) => ({
          id: item?.company_branche?.id,
          name: item?.company_branche?.name,
          cnpj: item?.company_branche?.cnpj,
          createdAt: item.created_at,
        }));

        return mappedData;
      }),
      finalize(() => this.loadingService.hide()),
    );
  }
}
