import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ISupplierView } from '../../model/supplie-view.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { SupplierService } from '../../services/supplier.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CnpjPipe } from '../../../../shared/pipes/cnpj/cnpj-pipe';

@Component({
  selector: 'app-supplier-table',
  imports: [
    Spinner,
    MatInputModule,
    MatPaginatorModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    CnpjPipe,
  ],
  templateUrl: './supplier-table.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class SupplierTable {
  loading = inject(LoadingService).loading;
  columnsToDisplay = ['id', 'name', 'cnpj', 'created_at', 'updated_at'];
  dataSource = new MatTableDataSource<ISupplierView>([]);
  searchTerm = '';

  paginatorDataSource: IDefaultPaginatorDataSource<ISupplierView> = {
    pageIndex: 0,
    pageSize: 10,
    records: { data: [], count: 0 },
  };

  private search$ = new Subject<string>();

  constructor(
    private cdr: ChangeDetectorRef,
    private supplierService: SupplierService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.reload();

    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm = value;
      this.paginatorDataSource.pageIndex = 0;
      this.reload();
    });
  }

  loadSuppliers(paginator: IDefaultPaginatorDataSource<ISupplierView>, search?: string) {
    this.supplierService.getSuppliers(paginator, search).subscribe({
      next: (response) => {
        this.paginatorDataSource.records = response;
        this.dataSource.data = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao carregar concorrentes: ${err.message || err}`);
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  onPageChange(event: PageEvent): void {
    this.paginatorDataSource.pageSize = event.pageSize;
    this.paginatorDataSource.pageIndex = event.pageIndex;
    this.reload();
  }

  private reload(): void {
    this.loadSuppliers(this.paginatorDataSource, this.searchTerm);
  }

  navigateToSupplierForm(supplierId: number) {
    this.router.navigate(['suppliers/form', supplierId]);
  }
}
