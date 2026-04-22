import { Injectable } from '@angular/core';
import {
  EnumFilterSupplierFlyerProducts,
  EnumWarningProductType,
} from 'src/app/core/enums/product.enum';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import {
  ISupplierFlyerProductsView,
  ISupplierFlyerView,
} from 'src/app/core/models/supplier-flyer.model';
import { SupplierFlyerRepository } from 'src/app/core/repositories/supplier-flyer.repository';

@Injectable({
  providedIn: 'root',
})
export class SupplierFlyerService {
  constructor(private repository: SupplierFlyerRepository) {}

  loadFlyers(
    paginator: IDefaultPaginatorDataSource<ISupplierFlyerView>,
    search?: string,
    id?: number,
  ) {
    return this.repository.loadSupplierFlyers(paginator, search, id);
  }

  loadProducts(
    flyerId: number,
    idIntegral: number,
    paginator: IDefaultPaginatorDataSource<ISupplierFlyerProductsView>,
    search?: string,
    selectedFilterType?: EnumFilterSupplierFlyerProducts,
  ) {
    return this.repository.loadProduts(flyerId, idIntegral, paginator, search, selectedFilterType);
  }

  updateProductPrice(flyerId: number, productId: number, price: number, columnName: string) {
    return this.repository.updateProductPrice(flyerId, productId, price, columnName);
  }

  updateWarningType(flyerId: number, productId: number, warningType?: EnumWarningProductType) {
    return this.repository.updateWarningType(flyerId, productId, warningType);
  }

  updatePriceDiscountPercent(flyerId: number, productId: number, discountPercent: number) {
    return this.repository.updatePriceDiscountPercent(flyerId, productId, discountPercent);
  }

  lockOrUnlockPrices(flyerId: number, lock: boolean, productId?: number) {
    return this.repository.lockOrUnlockPrices(flyerId, lock, productId);
  }

  sendPricesToErp(flyerId: number, productId?: number) {
    return this.repository.sendPricesToErp(flyerId, productId);
  }

  applySuggestedPrices(flyerId: number, onlyCompetitorPriceZero: boolean = false) {
    return this.repository.applySuggestedPrices(flyerId, onlyCompetitorPriceZero);
  }

  clearPrices(clearValues: any, flyerId: number) {
    return this.repository.clearPrices(clearValues, flyerId);
  }

  lockOrUnlockCompetitorPrices(flyerId: number, lockCompetitorPrices: boolean) {
    return this.repository.lockOrUnlockCompetitorPrices(flyerId, lockCompetitorPrices);
  }
}
