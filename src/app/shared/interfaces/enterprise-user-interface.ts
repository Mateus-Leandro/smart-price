export interface ICreateEnterpriseUser {
  user: {
    name: string;
    email: string;
    password: string;
  };
  enterprise: {
    id?: string;
    name: string;
    cnpj: string;
  };
}
