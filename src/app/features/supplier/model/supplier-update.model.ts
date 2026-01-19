import { SupplierDeliveryType } from '../enums/supplier-delivery-type.enum';

export interface IUpdateSupplier {
  supplierId: number;
  deliveryType: SupplierDeliveryType;
}
