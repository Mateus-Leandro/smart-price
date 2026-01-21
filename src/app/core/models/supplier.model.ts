import { SupplierDeliveryTypeEnum } from 'src/app/core/enums/supplier.enum';

export interface ISupplier {
  id: number;
  companyId: number;
  cnpj: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISupplierView {
  id: number;
  cnpj: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateSupplier {
  supplierId: number;
  deliveryType: SupplierDeliveryTypeEnum;
}
