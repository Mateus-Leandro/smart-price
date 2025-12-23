export interface IPromotionalflyer {
  id: number;
  name: string;
  createdDate: string;
  status: string;
}

export interface IPromotionalFlyerProducts {
  id: string;
  name: string;
  salePrice?: number;
}
