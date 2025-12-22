import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { PromotionalFlyerService } from '../../services/promotional-flyer.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { IPromotionalFlyerProducts } from '../../../../shared/interfaces/promotional-flyer.interface';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { IDefaultPaginatorDataSource } from 'src/app/shared/interfaces/query-interface';

@Component({
  selector: 'app-promotional-flyer-product-table',
  imports: [Spinner, IconButton, MatTableModule, MatSortModule, MatPaginator, MatPaginatorModule],
  templateUrl: './promotional-flyer-product-table.html',
  styleUrl: './promotional-flyer-product-table.scss',
})
export class PromotionalFlyerProductTable {
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;
  flyerId: number = 0;
  sortEvent!: Sort;
  dataSource = new MatTableDataSource<IPromotionalFlyerProducts>([]);
  paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerProducts> = {
    pageIndex: 0,
    pageSize: 10,
    records: {
      data: [],
      count: 0,
    },
  };

  constructor(
    private promotionalFlyerService: PromotionalFlyerService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.flyerId = Number(this?.route?.snapshot?.paramMap?.get('id'));
    this.loadProductsFromPromotionalFlyer(this.flyerId, this.paginatorDataSource);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  async loadProductsFromPromotionalFlyer(
    flyerId: number,
    paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerProducts>,
  ) {
    this.loading = true;

    try {
      this.paginatorDataSource.records = await this.promotionalFlyerService.loadProducts(
        flyerId,
        paginatorDataSource,
      );
      this.dataSource.data = this.paginatorDataSource.records.data;
    } catch (err) {
      console.error(`Erro ao buscar produtos do encarte ${flyerId}`, err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  onPageChange(event: PageEvent) {
    this.paginatorDataSource.pageSize = event.pageSize;
    this.paginatorDataSource.pageIndex = event.pageIndex;
    this.loadProductsFromPromotionalFlyer(this.flyerId, this.paginatorDataSource);
  }
}
