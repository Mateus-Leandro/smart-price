import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MaintenanceProductTable } from '../../components/maintenance-product-table/maintenance-product-table';
import { BtnReport } from 'src/app/shared/components/btn-report/btn-report';
import { ReportFilter } from './modal/report-filter/report-filter';
import { ProductService } from '../../services/product.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { IProductReportFilter } from '../../models/product-report.model';

@Component({
  selector: 'app-product-maintenance',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MaintenanceProductTable,
    FlexLayoutModule,
    BtnReport,
  ],
  templateUrl: './product-maintenance.html',
  styleUrl: './product-maintenance.scss',
})
export class ProductMaintenance {
  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private notificationService: NotificationService,
  ) {}

  openReportFilterDialog() {
    this.dialog
      .open(ReportFilter, {
        width: '480px',
        disableClose: false,
        autoFocus: true,
      })
      .afterClosed()
      .subscribe((filters?: IProductReportFilter) => {
        if (!filters) {
          return;
        }

        this.generateProductsReport(filters);
      });
  }

  private generateProductsReport(filters: IProductReportFilter): void {
    this.productService.generateProductsReport(filters).subscribe({
      next: (result) => {
        if (!result.generated) {
          this.notificationService.showWarning('Nenhum produto encontrado para gerar o relatório.');
          return;
        }

        this.notificationService.showSuccess(
          `Relatório gerado com ${result.totalProducts} produto(s).`,
        );
      },
      error: (err) => {
        this.notificationService.showError(
          `Erro ao gerar relatório de produtos: ${err.message || err}`,
        );
      },
    });
  }
}
