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
  columnsToDisplay = ['id', 'name', 'created_at', 'updated_at'];
  dataSource = new MatTableDataSource<ICompetitor>([]);
  searchTerm = '';

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
  ) {}

  ngOnInit(): void {
    this.reload();

    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm = value;
      this.paginatorDataSource.pageIndex = 0;
      this.reload();
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
        console.error('Erro ao carregar concorrentes', err);
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
}
