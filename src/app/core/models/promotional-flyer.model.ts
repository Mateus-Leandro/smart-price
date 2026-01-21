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
  name: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  finished: boolean;
  totalProducts: number;
}

export interface IPromotionalFlyerProductsView {
  salePrice?: number;
  loyaltyPrice?: number;
  quoteCost?: number;
  currentCostPrice?: number;
  currentSalePrice?: number;
  currentLoyaltyPrice?: number;
  erpImportDate?: string;
  product: {
    id: number;
    name: string;
  };
  supplier: {
    id: number;
    name: string;
  };
}
