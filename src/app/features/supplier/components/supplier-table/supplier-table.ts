import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoadingService } from 'src/app/core/services/loading.service';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { SupplierService } from '../../services/supplier.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CnpjPipe } from '../../../../shared/pipes/cnpj/cnpj-pipe';
import { DeliveryTypePipe } from '../../../../shared/pipes/delivery-type/delivery-type-pipe';
import { IconFilterButton } from 'src/app/shared/components/icon-filter-button/icon-filter-button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SupplierDeliveryTypeEnum } from '../../../../core/enums/supplier.enum';
import { IFilterOptions } from 'src/app/shared/components/icon-filter-button/icon-filter-list';
import { ISupplierView } from 'src/app/core/models/supplier.model';

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
    DeliveryTypePipe,
    IconFilterButton,
    FlexLayoutModule,
  ],
  templateUrl: './supplier-table.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class SupplierTable {
  loading = inject(LoadingService).loading;
  columnsToDisplay = ['id', 'name', 'delivery_type', 'cnpj', 'created_at', 'updated_at'];
  dataSource = new MatTableDataSource<ISupplierView>([]);
  searchTerm = '';
  filterOptions: IFilterOptions<SupplierDeliveryTypeEnum>[] = Object.entries(
    SupplierDeliveryTypeEnum,
  ).map(([key, value]) => ({
    label: key,
    value: value,
  }));

  selectedDeliveryFilterType = signal<null | SupplierDeliveryTypeEnum>(null);
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
  ) {
    effect(() => {
      const filterValue = this.selectedDeliveryFilterType();
      this.paginatorDataSource.pageIndex = 0;

      this.reload(filterValue);
    });
  }

  aplicarFiltro(filterValue: any) {
    console.log(filterValue);
  }

  ngOnInit(): void {
    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm = value;
      this.paginatorDataSource.pageIndex = 0;
      this.reload(this.selectedDeliveryFilterType());
    });
  }

  loadSuppliers(
    paginator: IDefaultPaginatorDataSource<ISupplierView>,
    deliveryType: null | SupplierDeliveryTypeEnum,
    search?: string,
  ) {
    this.supplierService.getSuppliers(paginator, deliveryType, search).subscribe({
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
    this.reload(this.selectedDeliveryFilterType());
  }

  private reload(deliveryType: null | SupplierDeliveryTypeEnum): void {
    this.loadSuppliers(this.paginatorDataSource, deliveryType, this.searchTerm);
  }

  navigateToSupplierForm(supplierId: number) {
    this.router.navigate(['suppliers/form', supplierId]);
  }
}
