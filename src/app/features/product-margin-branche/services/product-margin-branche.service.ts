import { Injectable } from '@angular/core';
import {
  IDeleteProductMarginBranche,
  IUpserProductMarginBranche,
} from 'src/app/core/models/product-margin.model';
import { ProductMarginBrancheRepository } from 'src/app/core/repositories/product-margin-branche.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductMarginBrancheService {
  constructor(private repository: ProductMarginBrancheRepository) {}

  upsertProductMarginBranche(upserProductMarginBranche: IUpserProductMarginBranche) {
    return this.repository.upsertProductMarginBranche(upserProductMarginBranche);
  }

  deleteProductMarginBranche(deleteProductMarginBranche: IDeleteProductMarginBranche) {
    return this.repository.deleteProductMarginBranche(deleteProductMarginBranche);
  }
}
