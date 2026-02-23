import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { finalize, from, map } from 'rxjs';
import { ICompanySettings, ICompanySettingsView } from '../models/company-settings.model';

@Injectable({ providedIn: 'root' })
export class CompanySettingsRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  loadCompanySettings(companyId: number) {
    this.loadingService.show();
    return from(
      this.supabase
        .from('company_settings')
        .select(
          `
      increase_price_percent
      `,
        )
        .eq('company_id', companyId)
        .maybeSingle(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        const mappedData = {
          increasePricePercent: data?.increase_price_percent || 0,
        };

        return { data: mappedData };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  saveCompanySettings(companySettings: ICompanySettings) {
    const settingsToSave = {
      company_id: companySettings.companyId,
      increase_price_percent: companySettings.increasePricePercent,
    };

    return from(
      this.supabase.from('company_settings').upsert(settingsToSave, { onConflict: 'company_id' }),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }
}
