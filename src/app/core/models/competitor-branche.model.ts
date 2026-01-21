export interface ICompetitorBranche {
  companyId: number;
  competitorId: number;
  brancheId: number;
  createdAt: string;
}

export interface ICompetitorBrancheUpsert {
  competitorId: number;
  brancheIds: number[];
}

export interface ICompetitorBrancheView {
  id: number;
  name: string;
  cnpj: string;
  createdAt: string;
}
