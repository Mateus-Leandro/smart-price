export interface IDeleteProductMarginBranche {
  companyId: number;
  productId: number;
  brancheId: number;
}

export interface IUpserProductMarginBranche {
  companyId: number;
  productId: number;
  brancheId: number;
  margin: number;
}

export interface IProductMarginBranche {
  brancheId: number;
  margin: number;
}
