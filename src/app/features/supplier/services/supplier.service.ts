import { Injectable } from '@angular/core';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { SupplierRepository } from 'src/app/core/repositories/supplier.repository';
import { ISupplierView } from '../model/supplier-view.model';
import { IUpdateSupplier } from '../model/supplier-update.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private repository: SupplierRepository) {}

  getSuppliers(paginator: IDefaultPaginatorDataSource<ISupplierView>, search?: string) {
    return this.repository.getSuppliers(paginator, search);
  }

  getSupplierInfoById(supplierId: number) {
    return this.repository.getSupplierInfoById(supplierId);
  }

  updateSupplier(updateSupplier: IUpdateSupplier) {
    return this.repository.updateSupplier(updateSupplier);
  }
}
