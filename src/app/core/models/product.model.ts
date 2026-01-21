import { IProductMarginBranche } from './product-margin.model';

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
