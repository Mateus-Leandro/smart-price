import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PageEvent, MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { IProductView } from 'src/app/features/product/models/product.model';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { ProductService } from '../../services/product.service';
import { TableColumn } from 'src/app/core/models/table-app.model';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatTable,
  MatHeaderCellDef,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-product-maintenance-product-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    Spinner,
    MatFormField,
    MatLabel,
    MatIcon,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTable,
    MatHeaderCellDef,
    MatPaginator,
    MatTableModule,
  ],
  templateUrl: './maintenance-product-table.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class MaintenanceProductTable implements OnInit {
  loading = inject(LoadingService).loading;
  searchTerm = '';
  dataSource = new MatTableDataSource<IProductView>([]);
  expandedElement: IProductView | null = null;
  columnsToDisplay = ['expand', 'id', 'name', 'created_at', 'updated_at'];

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
    this.productService.loadProducts(paginator, search).subscribe({
      next: (response) => {
        this.paginatorDataSource.records = response;
        this.dataSource.data = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar produtos', err);
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

  toggleRow(row: IProductView): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }
}
