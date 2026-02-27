import { Injectable } from '@angular/core';
import { CompetitorType } from 'src/app/core/models/competitor';
import {
  IDeleteAllCompetitorPriceByFlyerId,
  IDeleteCompetitorPriceFlyerProduct,
  IUpsertCompetitorPriceFlyerProduct,
} from 'src/app/core/models/competitor_price_flyer_products.model';
import { CompetitorPriceFlyerProductRepository } from 'src/app/core/repositories/competitor_price_flyer_product.repository';

@Injectable({
  providedIn: 'root',
})
export class CompetitorPriceFlyerProductService {
  constructor(private repository: CompetitorPriceFlyerProductRepository) {}
  upsertCompetitorPriceFlyerProduct(
    competitorPriceFlyerProduct: IUpsertCompetitorPriceFlyerProduct,
    competitorTable: CompetitorType,
  ) {
    return this.repository.upsertCompetitorPriceFlyerProduct(
      competitorPriceFlyerProduct,
      competitorTable,
    );
  }

  deleteCompetitorPriceFlyerProduct(
    deleteCompetitorPriceFlyerProduct: IDeleteCompetitorPriceFlyerProduct,
    competitorTable: CompetitorType,
  ) {
    return this.repository.deleteCompetitorPriceFlyerProduct(
      deleteCompetitorPriceFlyerProduct,
      competitorTable,
    );
  }

  deleteAllcompetitorPriceByFlyerId(
    deleteAllCompetitorPriceByFlyerId: IDeleteAllCompetitorPriceByFlyerId,
    competitorTable: CompetitorType,
  ) {
    return this.repository.deleteAllcompetitorPriceByFlyerId(
      deleteAllCompetitorPriceByFlyerId,
      competitorTable,
    );
  }
}
