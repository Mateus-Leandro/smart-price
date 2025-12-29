export interface IPromotionalflyer {
  id: number;
  name: string;
  createdDate?: string | null;
  status: string;
  totalProducts: number;
}

export interface IPromotionalFlyerProducts {
  id: number;
  name: string;
  salePrice?: number;
  quoteCost: number;
  currentCostPrice: number;
  currentSalePrice: number;
  currentLoyaltyPrice: number;
  supplierId: number;
  supplierName: string;
  erpImportDate?: string | null;
}
