import { EnumWarningProductType } from '../enums/product.enum';

export interface IPromotionalFlyer {
  id: number;
  name: string;
  companyId: number;
  idIntegral: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  finished: boolean;
}

export interface IPromotionalFlyerView {
  id: number;
  idIntegral: number;
  branche: {
    id: number;
    name: string;
  };
  name: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  finished: boolean;
  totalProducts: number;
  importedProducts: number;
}

export interface IPromotionalFlyerCompetitorPrices {
  price: number;
  competitor: {
    id: number;
    name: string;
  };
}

export interface IPromotionalFlyerProductsView {
  salePrice?: number;
  loyaltyPrice?: number;
  shippingPrice?: number;
  quoteCost?: number;
  averageCostQuote?: number;
  quantity_suppliers?: number;
  currentSalePrice?: number;
  currentLoyaltyPrice?: number;
  erpImportDate?: string;
  lockPrice?: boolean;
  priceDiscountPercent?: number;
  warningType?: EnumWarningProductType;
  product: {
    id: number;
    name: string;
    margin?: number;
  };
  supplier: {
    id: number;
    name: string;
  };
  competitorPrices: IPromotionalFlyerCompetitorPrices[];
}
