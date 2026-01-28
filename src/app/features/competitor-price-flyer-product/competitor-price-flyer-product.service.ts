import { Injectable } from '@angular/core';
import {
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
  ) {
    return this.repository.upsertCompetitorPriceFlyerProduct(competitorPriceFlyerProduct);
  }

  deleteCompetitorPriceFlyerProduct(
    deleteCompetitorPriceFlyerProduct: IDeleteCompetitorPriceFlyerProduct,
  ) {
    return this.repository.deleteCompetitorPriceFlyerProduct(deleteCompetitorPriceFlyerProduct);
  }
}
