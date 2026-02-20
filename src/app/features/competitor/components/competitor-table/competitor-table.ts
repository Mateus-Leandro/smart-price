import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { Router } from '@angular/router';
import {
  MatHeaderCellDef,
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { LoadingService } from 'src/app/core/services/loading.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { CommonModule } from '@angular/common';
import { CompetitorService } from '../../services/competitor.service';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { ICompetitor } from 'src/app/core/models/competitor';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ConfirmationDialog } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';
import { IUserPermission } from 'src/app/core/models/user-permission.model';
import { UserPermissionService } from 'src/app/features/user-permission/user-permission.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Component({
  selector: 'app-competitor-table',
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
    IconButton,
  ],
  templateUrl: './competitor-table.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class CompetitorTable {
  loading = inject(LoadingService).loading;
  columnsToDisplay = ['id', 'name', 'created_at', 'updated_at', 'delete'];
  dataSource = new MatTableDataSource<ICompetitor>([]);
  searchTerm = '';
  userPermissions: IUserPermission | null = null;

  paginatorDataSource: IDefaultPaginatorDataSource<ICompetitor> = {
    pageIndex: 0,
    pageSize: 10,
    records: { data: [], count: 0 },
  };

  private search$ = new Subject<string>();

  constructor(
    private cdr: ChangeDetectorRef,
    private competitorService: CompetitorService,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private userPermissionService: UserPermissionService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getUserPermissions();
    this.reload();

    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm = value;
      this.paginatorDataSource.pageIndex = 0;
      this.reload();
    });
  }

  private getUserPermissions() {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.userPermissionService.getPermissions(user.id).subscribe({
          next: (permissions) => {
            this.userPermissions = permissions;
          },
        });
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao buscar usuário logado: ${err.message || err}`);
      },
    });
  }

  loadCompetitors(paginator: IDefaultPaginatorDataSource<ICompetitor>, search?: string) {
    this.competitorService.loadCompetitors(paginator, search).subscribe({
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
    this.loadCompetitors(this.paginatorDataSource, this.searchTerm);
  }

  createCompetitor() {
    this.router.navigate(['competitors/form']);
  }

  navigateToCompetitorForm(competitorId: number) {
    this.router.navigate(['competitors/form', competitorId]);
  }

  deleteCompetitor(competitor: ICompetitor) {
    this.dialog
      .open(ConfirmationDialog, {
        width: '400px',
        disableClose: true,
        autoFocus: true,
        data: {
          titleText: `Excluir concorrente`,
          messageText: `Remover "${competitor.name}" da lista de concorrentes?`,
          confirmationText: 'Excluir Permanentemente',
          cancelText: 'Não',
          confirmationColor: 'var(--error-color)',
        },
      })
      .afterClosed()
      .subscribe((confirmation) => {
        if (confirmation) {
          this.competitorService.deleteCompetitor(competitor.id).subscribe({
            next: () => {
              this.notificationService.showSuccess('Concorrente excluído com sucesso!');
              this.reload();
            },
            error: (err) => {
              this.notificationService.showError(
                `Erro ao excluir concorrente: ${err.message | err}`,
              );
            },
          });
        }
      });
  }
}
