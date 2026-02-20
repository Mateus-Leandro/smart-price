import { Injectable } from '@angular/core';
import {
  ICreateSupplierShippingPrice,
  IDeleteSupplierShippingPrice,
} from 'src/app/core/models/supplier_shipping_price.model';
import { SupplierShippingPriceRepository } from 'src/app/core/repositories/supplier_shipping_price.repository';

@Injectable({
  providedIn: 'root',
})
export class SupplierShippingPriceService {
  constructor(private repository: SupplierShippingPriceRepository) {}

  upsertSupplierShippingPrice(createSupplierShippingPrice: ICreateSupplierShippingPrice) {
    return this.repository.upsertSupplierShippingPrice(createSupplierShippingPrice);
  }

  deleteSupplierShippingPrice(deleteSupplierShippingPrice: IDeleteSupplierShippingPrice) {
    return this.repository.deleteSupplierShippingPrice(deleteSupplierShippingPrice);
  }
}
