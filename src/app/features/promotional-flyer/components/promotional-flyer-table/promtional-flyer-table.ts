import { ChangeDetectorRef, Component, inject, input, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { IconButton } from '../../../../shared/components/icon-button/icon-button';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { PromotionalFlyerService } from '../../services/promotional-flyer.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormField, MatLabel } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { IPromotionalFlyerView, TFlyerType } from 'src/app/core/models/promotional-flyer.model';
import { IUserPermission } from 'src/app/core/models/user-permission.model';
import { UserPermissionService } from 'src/app/features/user-permission/user-permission.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ISupplierFlyerView } from 'src/app/core/models/supplier-flyer.model';
import { SupplierFlyerService } from 'src/app/features/supplier-flyer/services/supplier-flyer.service';
import { CnpjPipe } from '../../../../shared/pipes/cnpj/cnpj-pipe';
import { ConfirmationDialog } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-promotional-flyer-table',
  imports: [
    MatTableModule,
    MatSortModule,
    MatIconModule,
    IconButton,
    Spinner,
    MatPaginator,
    MatFormField,
    MatLabel,
    MatInputModule,
    CommonModule,
    FlexLayoutModule,
    CnpjPipe,
  ],
  templateUrl: './promotional-flyer-table.html',
  styleUrl: './promotional-flyer-table.scss',
})
export class PromotionalFlyerTable {
  flyerType = input.required<TFlyerType>();
  @ViewChild(MatSort) sort!: MatSort;
  loading = inject(LoadingService).loading;
  searchTerm = '';
  dataSource = new MatTableDataSource<IPromotionalFlyerView | ISupplierFlyerView>([]);
  userPermissions: IUserPermission | null = null;

  paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerView | ISupplierFlyerView> = {
    pageIndex: 0,
    pageSize: 10,
    records: {
      data: [],
      count: 0,
    },
  };
  private search$ = new Subject<string>();
  sendingFlyerId?: number | null;

  constructor(
    private promotionalFlyerService: PromotionalFlyerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
    private userPermissionService: UserPermissionService,
    private supplierFlyerService: SupplierFlyerService,
    private dialog: MatDialog,
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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      if (property === 'data') {
        const [dia, mes, ano] = item.data.split('/');
        return new Date(`${ano}-${mes}-${dia}`).getTime();
      }

      if (property === 'produtos') {
        return Number(item.produtos.replace(/\D/g, ''));
      }

      return item[property];
    };
  }

  loadRecords(
    paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerView | ISupplierFlyerView>,
    search?: string,
  ) {
    this.getFlyerService()
      .loadFlyers(paginatorDataSource as any, search)
      .subscribe({
        next: (response: any) => {
          this.paginatorDataSource.records = response;
          this.dataSource.data = response.data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.notificationService.showError(
            `Erro ao buscar ${this.flyerType() === 'quote' ? 'cotações' : 'tabelas de fornecedores'} : ${err.message || err}`,
          );
          this.cdr.detectChanges();
        },
      });
  }

  navigateToPromotionalFlyerProduct(row: any) {
    this.router.navigate([`/promotional_flyer/${this.flyerType()}`, row.id]);
  }

  async sendPrices(flyerId: number) {
    this.sendingFlyerId = flyerId;
    this.getFlyerService()
      .sendPricesToErp(flyerId)
      .subscribe({
        next: () => {
          this.dialog
            .open(ConfirmationDialog, {
              width: '400px',
              disableClose: true,
              autoFocus: true,
              data: {
                titleText: `Travar Preços dos Concorrentes`,
                messageText: `Deseja travar os preços dos concorrentes? Após o travamento, não será possível modificá-los.`,
                confirmationText: 'Travar preços',
                cancelText: 'Não travar',
                confirmationColor: 'var(--primary)',
              },
            })
            .afterClosed()
            .subscribe((confirmation) => {
              if (confirmation) {
                this.getFlyerService()
                  .lockOrUnlockCompetitorPrices(flyerId, true)
                  .subscribe({
                    next: () => {
                      this.notificationService.showSuccess(
                        'Preços dos concorrentes travados corretamente',
                      );
                    },
                    error: (err: any) => {
                      this.notificationService.showError(
                        `Erro ao travar preços dos concorrentes: ${err?.message || err}`,
                      );
                    },
                  });
              }
            });
        },
        error: (err: any) => {
          this.notificationService.showError(
            `Erro ao enviar produtos para o ERP: ${err?.message || err}`,
          );
        },
        complete: () => {
          this.sendingFlyerId = null;
          this.cdr.detectChanges();
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.paginatorDataSource.pageSize = event.pageSize;
    this.paginatorDataSource.pageIndex = event.pageIndex;
    this.reload();
  }

  private reload(): void {
    this.loadRecords(this.paginatorDataSource, this.searchTerm);
  }

  formatQuoteId(quoteId: any): string {
    return String(quoteId).padStart(2, '0');
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  calculeCompletePercent(totalProducts: number, importedProducts: number) {
    return (100 * (importedProducts / totalProducts)).toFixed(2);
  }

  getFlyerService(): any {
    return this.flyerType() === 'quote' ? this.promotionalFlyerService : this.supplierFlyerService;
  }

  getColunsToDisplay() {
    return this.flyerType() === 'quote'
      ? ['id_integral', 'name', 'branche_id', 'created_date', 'status', 'produtos', 'send']
      : [
          'id_integral',
          'name',
          'supplier',
          'cnpj_supplier',
          'branche_id',
          'created_date',
          'status',
          'produtos',
          'send',
        ];
  }
}
