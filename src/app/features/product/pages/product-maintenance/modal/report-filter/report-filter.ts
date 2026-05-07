import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { Button } from 'src/app/shared/components/button/button';
import { IProductReportFilter } from 'src/app/features/product/models/product-report.model';

@Component({
  selector: 'app-report-filter',
  imports: [
    MatDialogModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatDividerModule,
    Button,
  ],
  templateUrl: './report-filter.html',
  styleUrl: './report-filter.scss',
})
export class ReportFilter {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ReportFilter, IProductReportFilter>);

  reportFilterForm = this.fb.group({
    marginOption: this.fb.control<IProductReportFilter['marginOption']>('with-margin', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    format: this.fb.control<IProductReportFilter['format']>('pdf', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    if (this.reportFilterForm.valid) {
      this.dialogRef.close(this.reportFilterForm.getRawValue());
    }
  }
}
