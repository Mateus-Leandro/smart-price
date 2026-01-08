export interface IRegisterCompanyAndUser {
  user: IUser;
  company: ICompany;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface ICompany {
  name: string;
  cnpj: string;
}

export interface ICreateUser {
  user: IUser;
  company: {
    id: number;
  };
}

export interface IUpdateUser {
  password?: string;
  email?: string;
}
