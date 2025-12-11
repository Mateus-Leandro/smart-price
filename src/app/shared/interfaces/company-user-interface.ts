export interface ICreateCompanyUser {
  user: {
    name: string;
    email: string;
    password: string;
  };
  company: {
    id?: string;
    name: string;
    cnpj: string;
  };
}
