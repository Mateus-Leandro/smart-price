import { Injectable } from '@angular/core';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { ProductRepository } from 'src/app/core/repositories/product.repository';
import { IProductView } from 'src/app/core/models/product.model';
import { MarginFilterEnum } from 'src/app/core/enums/product.enum';

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
