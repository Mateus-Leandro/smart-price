import { Injectable } from '@angular/core';
import { ProductMarginBrancheRepository } from 'src/app/core/repositories/product-margin-branche.repository';
import { IUpserProductMarginBranche } from '../models/product-margin-branche-upsert.model';
import { IDeleteProductMarginBranche } from '../models/product-margin-branche-delete.model';

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
