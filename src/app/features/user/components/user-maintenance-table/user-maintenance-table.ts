import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule, DatePipe } from '@angular/common';
import {
  MatHeaderCellDef,
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { IUserView } from 'src/app/core/models/user.model';
import { UserService } from '../../services/user.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-maintenance-table',
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
  templateUrl: './user-maintenance-table.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class UserMaintenanceTable {
  loading = inject(LoadingService).loading;
  columnsToDisplay = ['name', 'email', 'created_at', 'updated_at'];
  dataSource = new MatTableDataSource<IUserView>([]);
  searchTerm = '';

  paginatorDataSource: IDefaultPaginatorDataSource<IUserView> = {
    pageIndex: 0,
    pageSize: 10,
    records: { data: [], count: 0 },
  };

  private search$ = new Subject<string>();

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.reload();

    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm = value;
      this.paginatorDataSource.pageIndex = 0;
      this.reload();
    });
  }

  loadUsers(paginator: IDefaultPaginatorDataSource<IUserView>, search?: string) {
    this.userService.loadUsers(paginator, search).subscribe({
      next: (response) => {
        this.paginatorDataSource.records = response;
        this.dataSource.data = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar usuários', err);
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
    this.loadUsers(this.paginatorDataSource, this.searchTerm);
  }
}
