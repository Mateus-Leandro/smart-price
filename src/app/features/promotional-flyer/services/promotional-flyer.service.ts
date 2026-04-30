import { Injectable } from '@angular/core';
import { PromotionalFlyerRepository } from 'src/app/core/repositories/promotional-flyer.repository';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import {
  IPromotionalFlyerProductsView,
  IPromotionalFlyerView,
} from 'src/app/core/models/promotional-flyer.model';
import { EnumWarningProductType } from 'src/app/core/enums/product.enum';
import { EnumFilterPromotionalFlyerProducts } from 'src/app/core/enums/flyer.enum';

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

  applySuggestedPrices(flyerId: number, onlyCompetitorPriceZero: boolean = false) {
    return this.repository.applySuggestedPrices(flyerId, onlyCompetitorPriceZero);
  }

  lockOrUnlockPrices(flyerId: number, lock: boolean, productId?: number) {
    return this.repository.lockOrUnlockPrices(flyerId, lock, productId);
  }

  updatePriceDiscountPercent(flyerId: number, productId: number, discountPercent: number) {
    return this.repository.updatePriceDiscountPercent(flyerId, productId, discountPercent);
  }

  updateWarningType(flyerId: number, productId: number, warningType?: EnumWarningProductType) {
    return this.repository.updateWarningType(flyerId, productId, warningType);
  }

  clearPrices(clearValues: any, flyerId: number) {
    return this.repository.clearPrices(clearValues, flyerId);
  }

  lockOrUnlockCompetitorPrices(flyerId: number, lockCompetitorPrices: boolean) {
    return this.repository.lockOrUnlockCompetitorPrices(flyerId, lockCompetitorPrices);
  }

  updateAdditionalCost(flyerId: number, productId: number, additionalCost: number) {
    return this.repository.updateAdditionalCost(flyerId, productId, additionalCost);
  }
}
