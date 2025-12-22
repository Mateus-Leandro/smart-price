import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { PromotionalFlyerService } from '../../services/promotional-flyer.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { IPromotionalFlyerProducts } from '../../../../shared/interfaces/promotional-flyer.interface';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-promotional-flyer-product-table',
  imports: [Spinner, IconButton, MatTableModule, MatSortModule, MatPaginator, MatPaginatorModule],
  templateUrl: './promotional-flyer-product-table.html',
  styleUrl: './promotional-flyer-product-table.scss',
})
export class PromotionalFlyerProductTable {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  loading = false;
  dataSource = new MatTableDataSource<IPromotionalFlyerProducts>([]);
  flyerId: number = 0;
  pageSize = 10;
  pageIndex = 0;
  records!: {
    data: IPromotionalFlyerProducts[];
    count: number;
  };

  constructor(
    private promotionalFlyerService: PromotionalFlyerService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.flyerId = Number(this?.route?.snapshot?.paramMap?.get('id'));
    console.log(this.flyerId);
    this.loadProductsFromPromotionalFlyer(this.flyerId);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async loadProductsFromPromotionalFlyer(
    flyerId: number,
    pageIndex = this.pageIndex,
    pageSize = this.pageSize,
  ) {
    this.loading = true;

    try {
      this.records = await this.promotionalFlyerService.loadProducts(flyerId, pageIndex, pageSize);
      this.dataSource.data = this.records.data;
      this.paginator.length = this.records.count;
    } catch (err) {
      console.error(`Erro ao buscar produtos do encarte ${flyerId}`, err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadProductsFromPromotionalFlyer(this.flyerId, event.pageIndex, event.pageSize);
  }
}
