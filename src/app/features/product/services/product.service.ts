import { Injectable } from '@angular/core';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { ProductRepository } from 'src/app/core/repositories/product.repository';
import { IProductView } from '../models/product.model';
import { MarginFilterEnum } from '../enums/margin-filter.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private repository: ProductRepository) {}

  loadProducts(
    paginator: IDefaultPaginatorDataSource<IProductView>,
    marginFilter: MarginFilterEnum,
    search?: string,
  ) {
    return this.repository.getProducts(paginator, marginFilter, search);
  }
}
