import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMaskDirective } from 'ngx-mask';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { ISupplierProductView } from 'src/app/core/models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { ProductMarginBrancheService } from 'src/app/features/product-margin-branche/services/product-margin-branche.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';

@Component({
  selector: 'app-supplier-products-table',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Spinner,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    FlexLayoutModule,
    NgxMaskDirective,
  ],
  templateUrl: './supplier-products-table.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class SupplierProductsTable implements OnInit {
  loading = inject(LoadingService).loading;
  supplierId = 0;
  companyId = 0;
  searchTerm = '';
  dataSource = new MatTableDataSource<ISupplierProductView>([]);
  columnsToDisplay = ['id', 'name', 'branche', 'margin'];
  marginControls = new Map<string, FormControl>();

  paginatorDataSource: IDefaultPaginatorDataSource<ISupplierProductView> = {
    pageIndex: 0,
    pageSize: 10,
    records: { data: [], count: 0 },
  };

  private search$ = new Subject<string>();
  private cancelLoad$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private productMarginBrancheService: ProductMarginBrancheService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.supplierId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.supplierId) return;

    this.authService.getCompanyIdFromLoggedUser().subscribe({
      next: (companyId) => {
        this.companyId = companyId;
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao carregar empresa: ${err.message || err}`);
      },
    });

    this.reload();

    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm = value;
      this.paginatorDataSource.pageIndex = 0;
      this.reload();
    });
  }

  getMarginControl(row: ISupplierProductView): FormControl {
    return this.marginControls.get(`${row.productId}-${row.brancheId}`)!;
  }

  private buildMarginControls(data: ISupplierProductView[]) {
    data.forEach((row) => {
      const key = `${row.productId}-${row.brancheId}`;
      if (this.marginControls.has(key)) {
        this.marginControls.get(key)!.setValue(row.margin ?? '');
      } else {
        this.marginControls.set(key, new FormControl(row.margin ?? ''));
      }
    });
  }

  loadProducts(paginator: IDefaultPaginatorDataSource<ISupplierProductView>, search?: string) {
    this.cancelLoad$.next();
    this.supplierService.getProductsBySupplier(this.supplierId, paginator, search).pipe(takeUntil(this.cancelLoad$)).subscribe({
      next: (response) => {
        this.paginatorDataSource.records = response;
        this.dataSource.data = response.data;
        this.buildMarginControls(response.data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao carregar produtos: ${err.message || err}`);
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    this.cancelLoad$.next();
    this.cancelLoad$.complete();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  onPageChange(event: PageEvent) {
    this.paginatorDataSource.pageSize = event.pageSize;
    this.paginatorDataSource.pageIndex = event.pageIndex;
    this.reload();
  }

  onMarginBlur(event: FocusEvent, row: ISupplierProductView) {
    const ctrl = this.getMarginControl(row);
    const controlValue = ctrl?.value;
    const newValue =
      controlValue === '' || controlValue === null || controlValue === undefined
        ? null
        : parseFloat(String(controlValue).replace(',', '.'));

    if (newValue === row.margin) return;
    if (newValue !== null && isNaN(newValue)) {
      ctrl?.setValue(row.margin ?? '');
      return;
    }

    if (!this.companyId) {
      this.notificationService.showError('Empresa não carregada. Tente novamente.');
      return;
    }

    if (newValue !== null && newValue > 0) {
      this.productMarginBrancheService
        .upsertProductMarginBranche({
          companyId: this.companyId,
          brancheId: row.brancheId,
          productId: row.productId,
          margin: newValue,
        })
        .subscribe({
          next: () => {
            row.margin = newValue;
          },
          error: (err) => {
            ctrl?.setValue(row.margin ?? '');
            this.notificationService.showError(`Erro ao atualizar margem: ${err.message || err}`);
          },
        });
    } else {
      this.productMarginBrancheService
        .deleteProductMarginBranche({
          companyId: this.companyId,
          brancheId: row.brancheId,
          productId: row.productId,
        })
        .subscribe({
          next: () => {
            row.margin = null;
            ctrl?.setValue('');
          },
          error: (err) => {
            ctrl?.setValue(row.margin ?? '');
            this.notificationService.showError(`Erro ao atualizar margem: ${err.message || err}`);
          },
        });
    }
  }

  private reload() {
    this.loadProducts(this.paginatorDataSource, this.searchTerm);
  }
}
