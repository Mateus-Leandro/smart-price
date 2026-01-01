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
