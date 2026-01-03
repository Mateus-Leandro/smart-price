import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { IProductView } from 'src/app/features/product/models/product.model';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { ProductService } from '../../services/product.service';
import { TableColumn } from 'src/app/core/models/table-app.model';
import { Table } from 'src/app/shared/components/table/table';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-product-maintenance-product-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Table, FlexLayoutModule],
  templateUrl: './maintenance-product-table.html',
})
export class MaintenanceProductTable implements OnInit {
  loading = false;
  searchTerm = '';
  products: IProductView[] = [];

  paginatorDataSource: IDefaultPaginatorDataSource<IProductView> = {
    pageIndex: 0,
    pageSize: 10,
    records: { data: [], count: 0 },
  };

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
    { key: 'createdAt', label: 'Criado em', type: 'date' },
    { key: 'updatedAt', label: 'Alterado em', type: 'date' },
  ];

  private search$ = new Subject<string>();

  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.reload();

    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm = value;
      this.paginatorDataSource.pageIndex = 0;
      this.reload();
    });
  }

  loadProducts(paginator: IDefaultPaginatorDataSource<IProductView>, search?: string) {
    this.loading = true;
    this.productService.loadProducts(paginator, search).subscribe({
      next: (response) => {
        this.paginatorDataSource.records = response;
        this.products = response.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar produtos', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.paginatorDataSource.pageSize = event.pageSize;
    this.paginatorDataSource.pageIndex = event.pageIndex;
    this.reload();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  private reload(): void {
    this.loadProducts(this.paginatorDataSource, this.searchTerm);
  }
}
