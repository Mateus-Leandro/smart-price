import { Injectable } from '@angular/core';
import { ISuggestedPriceSettingUpsert } from 'src/app/core/models/suggested-price-setting.model';
import { SuggestedPriceSettingsRepository } from 'src/app/core/repositories/suggested-price-setting.repository';

@Injectable({
  providedIn: 'root',
})
export class SuggestedPriceSettingService {
  constructor(private repository: SuggestedPriceSettingsRepository) {}

  loadSuggestedPriceSettings(companyId: number) {
    return this.repository.getSuggestedPriceSettings(companyId);
  }

  upsertSuggestedPriceSettings(settings: ISuggestedPriceSettingUpsert) {
    return this.repository.upsertSuggestedPriceSettings(settings);
  }

  deleteSuggestedPriceSettings(settingId: string) {
    return this.repository.deleteSuggestedPriceSettings(settingId);
  }
}
