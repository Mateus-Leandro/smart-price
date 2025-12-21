import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { PromotionalFlyerService } from '../../services/promotional-flyer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { PromotionalFlyerProducts } from '../../interfaces/promotional-flyer.interface';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';

@Component({
  selector: 'app-promotional-flyer-product-table',
  imports: [Spinner, IconButton, MatTableModule, MatSortModule],
  templateUrl: './promotional-flyer-product-table.html',
  styleUrl: './promotional-flyer-product-table.scss',
})
export class PromotionalFlyerProductTable {
  @ViewChild(MatSort) sort!: MatSort;
  loading = false;
  dataSource = new MatTableDataSource<PromotionalFlyerProducts>([]);
  flyerId: number = 0;

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
  }

  async loadProductsFromPromotionalFlyer(flyerId: number) {
    this.loading = true;
    try {
      const records = await this.promotionalFlyerService.loadProducts(flyerId);
      this.dataSource.data = records ?? [];
    } catch (err) {
      console.log(`Erro ao buscar produtos do encarte ${flyerId}`);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
