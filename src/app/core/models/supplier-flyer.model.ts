import { EnumWarningProductType } from '../enums/product.enum';
import { IPromotionalFlyerCompetitorPrices } from './promotional-flyer.model';

export interface ISupplierFlyer {
  id: number;
  idIntegral: number;
  name: string;
  brancheId: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISupplierFlyerProducts {
  supplierFlyerId: number;
  companyId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
  salePrice: number;
  sendToErp: boolean;
  currentSalePrice: number;
  currentLoyaltyPrice: number;
  erpImportDate: string;
  loyaltyPrice: number;
  lockPrice: boolean;
  priceDiscountPercent: number;
  previousCost: number;
  costPrice: number;
}

export interface ISupplierFlyerProductsView {
  salePrice: number;
  sendToErp: boolean;
  currentSalePrice: number;
  currentLoyaltyPrice: number;
  erpImportDate: string;
  loyaltyPrice: number;
  lockPrice: boolean;
  priceDiscountPercent: number;
  previousCost: number;
  costPrice: number;
  competitorPrices: IPromotionalFlyerCompetitorPrices[];
  product: {
    id: number;
    name: string;
    margin: number;
  };
  warningType: EnumWarningProductType;
}

export interface ISupplierFlyerView {
  id: number;
  idIntegral: number;
  name: string;
  branche: {
    id: number;
    name: string;
  };
  supplier: {
    id: number;
    name: string;
    cnpj: string;
  };
  createdAt: string;
  updatedAt: string;
}
