export interface IPromotionalflyer {
  id: number;
  name: string;
  createdDate: string;
  status: string;
  totalProducts: number;
}

export interface IPromotionalFlyerProducts {
  id: number;
  name: string;
  salePrice?: number;
  currentCostPrice: number;
  currentSalePrice: number;
  quoteCost: number;
}
