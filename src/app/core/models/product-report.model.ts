export type ProductReportMarginOption = 'with-margin' | 'without-margin';
export type ProductReportFormat = 'xlsx' | 'pdf';

export interface IProductReportFilter {
  marginOption: ProductReportMarginOption;
  format: ProductReportFormat;
}

export interface IProductReportMarginView {
  brancheId: number;
  brancheName: string;
  margin: number;
}

export interface IProductReportView {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  marginBranches: IProductReportMarginView[];
}

export interface IProductReportByCompanyItem {
  productName: string;
  margin: number;
}

export interface IProductReportByCompany {
  brancheId: number;
  companyName: string;
  products: IProductReportByCompanyItem[];
}

export interface IProductReportGenerationResult {
  generated: boolean;
  totalProducts: number;
  fileName?: string;
}
