export interface ICompetitorPriceFlyerProduct {
  productId: number;
  price: number;
  companyId: number;
  competitorId: number;
  promotionalFlyerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUpsertCompetitorPriceFlyerProduct {
  productId: number;
  price: number;
  companyId: number;
  competitorId: number;
  promotionalFlyerId: number;
}

export interface IDeleteCompetitorPriceFlyerProduct {
  productId: number;
  companyId: number;
  competitorId: number;
  promotionalFlyerId: number;
}
