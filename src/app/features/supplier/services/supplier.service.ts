import { Injectable } from '@angular/core';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { SupplierRepository } from 'src/app/core/repositories/supplier.repository';
import { EnumSupplierDeliveryTypeEnum } from '../../../core/enums/supplier.enum';
import { ISupplierView, IUpdateSupplier } from 'src/app/core/models/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private repository: SupplierRepository) {}

  getSuppliers(
    paginator: IDefaultPaginatorDataSource<ISupplierView>,
    deliveryType: null | EnumSupplierDeliveryTypeEnum | 'EMPTY',
    search?: string,
  ) {
    return this.repository.getSuppliers(paginator, deliveryType, search);
  }

  getSupplierInfoById(supplierId: number) {
    return this.repository.getSupplierInfoById(supplierId);
  }

  updateSupplier(updateSupplier: IUpdateSupplier) {
    return this.repository.updateSupplier(updateSupplier);
  }
}
