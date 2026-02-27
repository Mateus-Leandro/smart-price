export interface ICompetitor {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateCompetitor {
  id: number;
  name: string;
}

export interface ICompetitorView extends ICompetitor {
  competitorBranches: { brancheId: number }[];
}

export type CompetitorType =
  | 'competitor_price_flyer_products'
  | 'competitor_price_supplier_flyer_products';
