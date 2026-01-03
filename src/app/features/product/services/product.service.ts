import { Injectable } from '@angular/core';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { ProductRepository } from 'src/app/core/repositories/product.repository';
import { IProductView } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private repository: ProductRepository) {}

  loadProducts(paginator: IDefaultPaginatorDataSource<IProductView>, search?: string) {
    return this.repository.getProducts(paginator, search);
  }
}
