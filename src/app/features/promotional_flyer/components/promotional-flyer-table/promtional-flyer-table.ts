import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { IconButton } from '../../../../shared/components/icon-button/icon-button';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { IPromotionalflyer } from '../../../../shared/interfaces/promotional-flyer.interface';
import { PromotionalFlyerService } from '../../services/promotional-flyer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promotional-flyer-table',
  imports: [MatTableModule, MatSortModule, MatIconModule, IconButton, Spinner],
  templateUrl: './promotional-flyer-table.html',
  styleUrl: './promotional-flyer-table.scss',
})
export class PromotionalFlyerTable {
  @ViewChild(MatSort) sort!: MatSort;
  loading = false;
  dataSource = new MatTableDataSource<IPromotionalflyer>([]);

  constructor(
    private pricingRecordsService: PromotionalFlyerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPrincingRecords();
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

  async loadPrincingRecords() {
    try {
      this.loading = true;
      const records = await this.pricingRecordsService.loadFlyers();
      this.dataSource.data = records ?? [];
    } catch (err) {
      console.error('Erro ao carregar registros', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  navigateToPromotionalFlyerProduct(row: any) {
    this.router.navigate(['/promotional_flyer', row.id]);
  }
}
