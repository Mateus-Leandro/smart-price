export interface ICompanyBranche {
  id: number;
  companyId: number;
  cnpj: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICompanyBrancheView {
  id: number;
  name: string;
  cnpj: string;
  createdAt: string;
  updatedAt: string;
}
