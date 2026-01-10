import { Component, inject } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { LoadingService } from 'src/app/core/services/loading.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ICompanyBrancheView } from '../../models/company-branch-view.model';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { CompanyBrancheService } from '../../services/company-branche.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { CnpjPipe } from 'src/app/shared/pipes/cnpj/cnpj-pipe';

@Component({
  selector: 'app-company-branche-table',
  imports: [
    MatFormField,
    MatLabel,
    MatIcon,
    Spinner,
    MatPaginator,
    MatTableModule,
    CommonModule,
    FlexLayoutModule,
    MatInputModule,
    CommonModule,
    CnpjPipe,
  ],
  templateUrl: './company-branche-table.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class CompanyBrancheTable {
  loading = inject(LoadingService).loading;
  searchTerm = '';
  columnsToDisplay = ['store', 'name', 'cnpj', 'created_at', 'updated_at'];
  dataSource = new MatTableDataSource<ICompanyBrancheView>([]);
  private search$ = new Subject<string>();

  constructor(private companyBrancheService: CompanyBrancheService) {}

  paginatorDataSource: IDefaultPaginatorDataSource<ICompanyBrancheView> = {
    pageIndex: 0,
    pageSize: 10,
    records: { data: [], count: 0 },
  };

  ngOnInit(): void {
    this.reload();

    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm = value;
      this.paginatorDataSource.pageIndex = 0;
      this.reload();
    });
  }

  loadCompanyBranches(
    paginator: IDefaultPaginatorDataSource<ICompanyBrancheView>,
    search?: string,
  ) {
    this.companyBrancheService.loadCompanyBranches(paginator, search).subscribe({
      next: (response) => {
        this.paginatorDataSource.records = response;
        this.dataSource.data = response.data;
      },
      error: (err) => {
        console.error('Erro ao carregar filiais', err);
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
    this.loadCompanyBranches(this.paginatorDataSource, this.searchTerm);
  }
}
