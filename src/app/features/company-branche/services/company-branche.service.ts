import { Injectable } from '@angular/core';
import { ICompanyBrancheView } from 'src/app/core/models/company-branche.model';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { CompanyBrancheRepository } from 'src/app/core/repositories/company-branche.repository';

@Injectable({
  providedIn: 'root',
})
export class CompanyBrancheService {
  constructor(private repository: CompanyBrancheRepository) {}

  loadCompanyBranches(
    paginator: IDefaultPaginatorDataSource<ICompanyBrancheView>,
    search?: string,
  ) {
    return this.repository.loadCompanyBranches(paginator, search);
  }
}
