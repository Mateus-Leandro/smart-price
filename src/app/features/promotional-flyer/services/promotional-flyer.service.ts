import { Injectable } from '@angular/core';
import { PromotionalFlyerRepository } from 'src/app/core/repositories/promotional-flyer.repository';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { IPromotionalFlyerProductsView, IPromotionalFlyerView } from '../models/flyer-view.model';
import { ProductPriceType } from '../enums/product-price-type.enum';

@Injectable({
  providedIn: 'root',
})
export class PromotionalFlyerService {
  constructor(private repository: PromotionalFlyerRepository) {}

  loadFlyers(paginator: IDefaultPaginatorDataSource<IPromotionalFlyerView>, search?: string) {
    return this.repository.getFlyers(paginator, search);
  }

  loadProducts(
    flyerId: number,
    paginator: IDefaultPaginatorDataSource<IPromotionalFlyerProductsView>,
    search?: string,
  ) {
    return this.repository.getProducts(flyerId, paginator, search);
  }

  updateProductPrice(
    flyerId: number,
    productId: number,
    price: number,
    productPriceType: ProductPriceType,
  ) {
    return this.repository.updateProductPrice(flyerId, productId, price, productPriceType);
  }

  sendPricesToErp(flyerId: number, productId?: number) {
    return this.repository.sendPricesToErp(flyerId, productId);
  }
}
