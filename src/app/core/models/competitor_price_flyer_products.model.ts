export interface ICompetitorPriceFlyerProduct {
  integralFlyerId: number;
  productId: number;
  competitorId: number;
  companyId: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}
export interface IDeleteCompetitorPriceFlyerProduct {
  integralFlyerId: number;
  productId: number;
  competitorId: number;
  companyId: number;
}
export interface IUpsertCompetitorPriceFlyerProduct extends IDeleteCompetitorPriceFlyerProduct {
  price: number;
}
