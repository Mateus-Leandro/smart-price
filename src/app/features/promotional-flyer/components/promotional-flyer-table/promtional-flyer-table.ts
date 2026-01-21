import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
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
import { IPromotionalFlyerView } from 'src/app/core/models/promotional-flyer.model';

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
  ],
  templateUrl: './promotional-flyer-table.html',
  styleUrl: './promotional-flyer-table.scss',
})
export class PromotionalFlyerTable {
  @ViewChild(MatSort) sort!: MatSort;
  loading = inject(LoadingService).loading;
  searchTerm = '';
  dataSource = new MatTableDataSource<IPromotionalFlyerView>([]);
  paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerView> = {
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
  ) {}

  ngOnInit(): void {
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

  loadPrincingRecords(
    paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerView>,
    search?: string,
  ) {
    this.promotionalFlyerService.loadFlyers(paginatorDataSource, search).subscribe({
      next: (response) => {
        this.paginatorDataSource.records = response;
        this.dataSource.data = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao buscar cotações: ${err.message || err}`);
        this.cdr.detectChanges();
      },
    });
  }

  navigateToPromotionalFlyerProduct(row: any) {
    this.router.navigate(['/promotional_flyer', row.id]);
  }

  async sendPrices(flyerId: number) {
    try {
      this.sendingFlyerId = flyerId;
      await this.promotionalFlyerService.sendPricesToErp(flyerId);
    } catch (error) {
      console.error(error);
    } finally {
      this.sendingFlyerId = null;
      this.cdr.detectChanges();
    }
  }

  onPageChange(event: PageEvent): void {
    this.paginatorDataSource.pageSize = event.pageSize;
    this.paginatorDataSource.pageIndex = event.pageIndex;
    this.reload();
  }

  private reload(): void {
    this.loadPrincingRecords(this.paginatorDataSource, this.searchTerm);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }
}
