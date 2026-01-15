import { IProductMarginBranche } from '../../product-margin-branche/models/product-margin-branche-view.model';

export interface IProduct {
  id: number;
  companyId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProductView {
  id: number;
  name: string;
  marginBranches: IProductMarginBranche[];
  createdAt: string;
  updatedAt: string;
}
