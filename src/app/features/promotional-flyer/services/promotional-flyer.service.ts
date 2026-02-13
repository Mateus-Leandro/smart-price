import { Injectable } from '@angular/core';
import { PromotionalFlyerRepository } from 'src/app/core/repositories/promotional-flyer.repository';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import {
  IPromotionalFlyerProductsView,
  IPromotionalFlyerView,
} from 'src/app/core/models/promotional-flyer.model';
import { EnumFilterPromotionalFlyerProducts } from 'src/app/core/enums/product.enum';

@Injectable({
  providedIn: 'root',
})
export class PromotionalFlyerService {
  constructor(private repository: PromotionalFlyerRepository) {}

  loadFlyers(
    paginator: IDefaultPaginatorDataSource<IPromotionalFlyerView>,
    search?: string,
    flyerId?: number,
  ) {
    return this.repository.getFlyers(paginator, search, flyerId);
  }

  loadProducts(
    flyerId: number,
    idIntegral: number,
    paginator: IDefaultPaginatorDataSource<IPromotionalFlyerProductsView>,
    search?: string,
    selectedFilterType?: EnumFilterPromotionalFlyerProducts,
  ) {
    return this.repository.getProducts(flyerId, idIntegral, paginator, search, selectedFilterType);
  }

  updateProductPrice(flyerId: number, productId: number, price: number, columnName: string) {
    return this.repository.updateProductPrice(flyerId, productId, price, columnName);
  }

  sendPricesToErp(flyerId: number, productId?: number) {
    return this.repository.sendPricesToErp(flyerId, productId);
  }

  applySuggestedPrices(flyerId: number) {
    return this.repository.applySuggestedPrices(flyerId);
  }

  lockOrUnlockPrices(flyerId: number, productId: number, lock: boolean) {
    return this.repository.lockOrUnlockPrices(flyerId, productId, lock);
  }
}
