import { Component, inject } from '@angular/core';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { SupplierForm } from '../../components/supplier-form/supplier-form';
import { Button } from 'src/app/shared/components/button/button';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SupplierService } from '../../services/supplier.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { IUpdateSupplier } from 'src/app/core/models/supplier.model';
import { SupplierProductsTable } from '../../components/supplier-products-table/supplier-products-table';
import { BtnReport } from 'src/app/shared/components/btn-report/btn-report';
import { ReportFilter } from 'src/app/shared/components/report-filter/report-filter';
import { ProductReportService } from 'src/app/shared/services/product-report.service';
import { IProductReportFilter } from 'src/app/core/models/product-report.model';

@Component({
  selector: 'app-supplier-maintenance',
  imports: [
    Spinner,
    MatCardModule,
    SupplierForm,
    Button,
    FlexLayoutModule,
    SupplierProductsTable,
    BtnReport,
  ],
  templateUrl: './supplier-maintenance.html',
  styleUrl: './supplier-maintenance.scss',
})
export class SupplierMaintenance {
  loading = inject(LoadingService).loading;
  supplierId = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private productReportService: ProductReportService,
  ) {}

  saveSupplier(supplierFormGroup: FormGroup) {
    console.log(supplierFormGroup.get('supplierDeliveryType')?.value);
    const updateSupplier: IUpdateSupplier = {
      deliveryType: supplierFormGroup.get('supplierDeliveryType')?.value,
      supplierId: supplierFormGroup.getRawValue().id,
    };
    this.supplierService.updateSupplier(updateSupplier).subscribe({
      next: () => {
        this.notificationService.showSuccess('Fornecedor salvo com sucesso!');
        this.returnToSuppliers();
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao atualizar fornecedor: ${err.message || err}`);
      },
    });
  }

  returnToSuppliers() {
    this.router.navigate(['/suppliers']);
  }

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

        this.generateSupplierProductsReport(filters);
      });
  }

  private generateSupplierProductsReport(filters: IProductReportFilter): void {
    this.productReportService.generateReport(filters, { supplierId: this.supplierId }).subscribe({
      next: (result) => {
        if (!result.generated) {
          this.notificationService.showWarning(
            'Nenhum produto vinculado encontrado para gerar o relatório.',
          );
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
