import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { finalize, from, map } from 'rxjs';
import {
  ISuggestedPriceSettingUpsert,
  ISuggestedPriceSettingView,
} from '../models/suggested-price-setting.model';

@Injectable({ providedIn: 'root' })
export class SuggestedPriceSettingsRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  getSuggestedPriceSettings(companyId: number) {
    this.loadingService.show();
    return from(
      this.supabase
        .from('suggested_price_settings')
        .select('id, margin_min, margin_max, discount_percent')
        .order('margin_min', { ascending: true })
        .eq('company_id', companyId),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        const mappedData: ISuggestedPriceSettingView[] = (data || []).map((item: any) => ({
          id: item.id,
          marginMin: item.margin_min,
          marginMax: item.margin_max,
          discountPercent: item.discount_percent,
        }));

        return mappedData;
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  upsertSuggestedPriceSettings(settings: ISuggestedPriceSettingUpsert) {
    this.loadingService.show();
    const settingsToSave = {
      id: settings.id || undefined,
      company_id: settings.companyId,
      margin_min: settings.marginMin,
      margin_max: settings.marginMax,
      discount_percent: settings.discountPercent,
    };

    return from(
      this.supabase.from('suggested_price_settings').upsert(settingsToSave, { onConflict: 'id' }),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      finalize(() => this.loadingService.hide()),
    );
  }
}
