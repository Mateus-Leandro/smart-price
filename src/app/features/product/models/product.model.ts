import { IMarginBranche } from './product-margin-branche-view.model';

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
  marginBranches: IMarginBranche[];
  createdAt: string;
  updatedAt: string;
}
