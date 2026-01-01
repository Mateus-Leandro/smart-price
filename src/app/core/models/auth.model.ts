export interface ICreateCompanyUser {
  user: IUser;
  company: ICompany;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  companyId?: number;
}

export interface ICompany {
  id?: number;
  name: string;
  cnpj: string;
}
