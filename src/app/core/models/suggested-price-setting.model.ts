export interface ISuggestedPriceSetting {
  id: string;
  companyId: number;
  marginMin: number;
  marginMax: number;
  discountPercent: number;
  createdAt: string;
}

export interface ISuggestedPriceSettingView {
  id: string;
  marginMin: number;
  marginMax: number;
  discountPercent: number;
}

export interface ISuggestedPriceSettingUpsert {
  id?: string;
  companyId: number;
  marginMin: number;
  marginMax: number;
  discountPercent: number;
}
