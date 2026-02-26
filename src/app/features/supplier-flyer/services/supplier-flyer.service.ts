import { Injectable } from '@angular/core';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { ISupplierFlyerView } from 'src/app/core/models/supplier-flyer.model';
import { SupplierFlyerRepository } from 'src/app/core/repositories/supplier-flyer.repository';

@Injectable({
  providedIn: 'root',
})
export class SupplierFlyerService {
  constructor(private repository: SupplierFlyerRepository) {}

  loadSupplierFlyers(paginator: IDefaultPaginatorDataSource<ISupplierFlyerView>, search?: string) {
    return this.repository.loadSupplierFlyers(paginator, search);
  }
}
