export interface IPromotionalFlyerProducts {
  id: number;
  companyId: number;
  productId: number;
  promotionalFlyerId: number;
  salePrice?: number;
  sendToErp: boolean;
  quoteCost: number;
  currentCostPrice: number;
  currentSalePrice: number;
  currentLoyaltyPrice: number;
  quoteSupplierId: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  erpImportDate?: string | null;
}
