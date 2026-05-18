export interface IUserPermission {
  userId: string;
  isAdmin: boolean;
  allowEditCompetitorPrices: boolean;
  allowEditPrices: boolean;
  allowEditShippingValue: boolean;
  allowSendToErp: boolean;
  allowEditShippingType: boolean;
  allowEditProductMargin: boolean;
  viewMargin?: boolean;
  viewCost?: boolean;
  viewSuggestedPriceOnMargin?: boolean;
  viewProductMargin?: boolean;
}
