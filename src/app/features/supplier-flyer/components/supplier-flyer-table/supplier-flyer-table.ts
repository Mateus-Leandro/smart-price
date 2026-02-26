import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { IUserPermission } from 'src/app/core/models/user-permission.model';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ISupplierFlyerView } from 'src/app/core/models/supplier-flyer.model';
import { SupplierFlyerService } from '../../services/supplier-flyer.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { UserPermissionService } from 'src/app/features/user-permission/user-permission.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { CnpjPipe } from '../../../../shared/pipes/cnpj/cnpj-pipe';

@Component({
  selector: 'app-supplier-flyer-table',
  imports: [
    Spinner,
    MatInputModule,
    MatPaginatorModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    FlexLayoutModule,
    IconButton,
    CnpjPipe,
  ],
  templateUrl: './supplier-flyer-table.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class SupplierFlyerTable {
  private search$ = new Subject<string>();
  dataSource = new MatTableDataSource<ISupplierFlyerView>([]);
  userPermissions: IUserPermission | null = null;
  loading = inject(LoadingService).loading;
  searchTerm = '';
  sendingFlyerId?: number | null;
  paginatorDataSource: IDefaultPaginatorDataSource<ISupplierFlyerView> = {
    pageIndex: 0,
    pageSize: 10,
    records: {
      data: [],
      count: 0,
    },
  };

  columnsToDisplay = ['id', 'name', 'branche_id', 'supplier', 'created_date', 'send'];

  constructor(
    private router: Router,
    private supplierFlyerService: SupplierFlyerService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private authService: AuthService,
    private userPermissionService: UserPermissionService,
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.userPermissionService.getPermissions(user.id).subscribe({
          next: (permissions) => {
            this.userPermissions = permissions;
          },
          error: (err) => {
            this.notificationService.showError(
              `Erro ao buscar permissões do usuário: ${err.message || err}`,
            );
          },
        });
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao buscar usuário: ${err.message || err}`);
      },
    });

    this.reload();

    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm = value;
      this.paginatorDataSource.pageIndex = 0;
      this.reload();
    });
  }

  loadSupplierFlyerRecords(
    paginatorDataSource: IDefaultPaginatorDataSource<ISupplierFlyerView>,
    search?: string,
  ) {
    this.supplierFlyerService.loadSupplierFlyers(paginatorDataSource, search).subscribe({
      next: (response) => {
        this.paginatorDataSource.records = response;
        this.dataSource.data = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.showError(
          `Erro ao buscar tabelas de fornecedores: ${err.message || err}`,
        );
        this.cdr.detectChanges();
      },
    });
  }

  private reload(): void {
    this.loadSupplierFlyerRecords(this.paginatorDataSource, this.searchTerm);
  }

  onPageChange(event: PageEvent): void {
    this.paginatorDataSource.pageSize = event.pageSize;
    this.paginatorDataSource.pageIndex = event.pageIndex;
    this.reload();
  }

  navigateToSupplierFlyerProduct(row: any) {
    this.router.navigate(['/supplier_flyer', row.id]);
  }

  formatStoreNumber(storeNumber: any): string {
    return String(storeNumber).padStart(2, '0');
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }
}
