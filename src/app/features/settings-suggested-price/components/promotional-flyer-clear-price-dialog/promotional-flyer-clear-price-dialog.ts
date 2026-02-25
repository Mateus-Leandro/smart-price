import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Checkbox } from 'src/app/shared/components/checkbox/checkbox';
import { Button } from 'src/app/shared/components/button/button';
import { MatDivider } from '@angular/material/divider';
import { OneCheckboxCheckedValidator } from 'src/app/shared/validators/one-checkbox-checked.validator';
import { ClearPriceResult } from 'src/app/core/models/promotional-flyer.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-promotional-flyer-clear-price-dialog',
  imports: [
    MatDialogModule,
    FlexLayoutModule,
    Checkbox,
    Button,
    ReactiveFormsModule,
    MatDivider,
    MatIconModule,
  ],
  templateUrl: './promotional-flyer-clear-price-dialog.html',
  styleUrl: './promotional-flyer-clear-price-dialog.scss',
})
export class PromotionalFlyerClearPriceDialog {
  clearPriceFormGroup: FormGroup;
  dialogRef = inject(MatDialogRef<PromotionalFlyerClearPriceDialog, ClearPriceResult>);

  constructor(private fb: FormBuilder) {
    this.clearPriceFormGroup = this.fb.group(
      {
        clearSalePrice: [false, { nonNullable: true }],
        clearLoyaltyPrice: [false, { nonNullable: true }],
        clearCompetitorPrice: [false, { nonNullable: true }],
      },
      { validators: OneCheckboxCheckedValidator() },
    );
  }

  submit() {
    if (this.clearPriceFormGroup.valid) {
      this.dialogRef.close(this.clearPriceFormGroup.value as ClearPriceResult);
    }
  }

  get clearCompetitorPrice(): boolean {
    return this.clearPriceFormGroup.get('clearCompetitorPrice')?.value;
  }
}
