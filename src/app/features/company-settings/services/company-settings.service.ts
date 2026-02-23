import { Injectable } from '@angular/core';
import { ICompanySettings } from 'src/app/core/models/company-settings.model';
import { CompanySettingsRepository } from 'src/app/core/repositories/company-settings.repository';

@Injectable({
  providedIn: 'root',
})
export class CompanySettingsService {
  constructor(private repository: CompanySettingsRepository) {}

  loadCompanySettings(companyId: number) {
    return this.repository.loadCompanySettings(companyId);
  }

  saveCompanySettings(companySettings: ICompanySettings) {
    return this.repository.saveCompanySettings(companySettings);
  }
}
