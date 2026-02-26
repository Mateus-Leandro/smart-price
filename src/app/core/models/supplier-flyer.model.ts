export interface ISupplierFlyer {
  id: number;
  name: string;
  brancheId: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISupplierFlyerView {
  id: number;
  name: string;
  branche: {
    id: number;
    name: string;
  };
  supplier: {
    id: number;
    name: string;
    cnpj: string;
  };
  createdAt: string;
  updatedAt: string;
}
