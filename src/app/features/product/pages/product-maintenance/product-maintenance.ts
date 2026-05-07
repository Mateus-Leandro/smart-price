import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MaintenanceProductTable } from '../../components/maintenance-product-table/maintenance-product-table';
import { BtnReport } from 'src/app/shared/components/btn-report/btn-report';
import { ReportFilter } from './modal/report-filter/report-filter';

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
  constructor(private dialog: MatDialog) {}

  openReportFilterDialog() {
    this.dialog.open(ReportFilter, {
      width: '480px',
      disableClose: false,
      autoFocus: true,
    });
  }
}
