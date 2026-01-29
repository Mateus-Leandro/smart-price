import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Button } from 'src/app/shared/components/button/button';
import { Spinner } from 'src/app/shared/components/spinner/spinner';

@Component({
  selector: 'app-settings-suggested-price-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    Button,
    Spinner,
    NgxMaskDirective,
  ],
  templateUrl: './suggested-price-settings-dialog.html',
  styleUrl: './suggested-price-settings-dialog.scss',
})
export class SuggestedPriceSettingsDialog {
  suggestedPriceSettingsFormGroup: FormGroup;
  loading = inject(LoadingService).loading;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SuggestedPriceSettingsDialog>,
    private notificationService: NotificationService,
  ) {
    this.suggestedPriceSettingsFormGroup = this.fb.group({
      marginMin: [
        '',
        [Validators.required, Validators.maxLength(3), Validators.max(100), Validators.min(0)],
      ],
      marginMax: [
        '',
        [Validators.required, Validators.maxLength(3), Validators.max(100), Validators.min(0)],
      ],
    });
  }

  submit() {
    if (this.suggestedPriceSettingsFormGroup.invalid) return;

    this.cancel();
  }

  cancel() {
    this.dialogRef.close();
  }

  get marginMin() {
    return this.suggestedPriceSettingsFormGroup.get('marginMin')! as FormControl;
  }

  get marginMax() {
    return this.suggestedPriceSettingsFormGroup.get('marginMax')! as FormControl;
  }
}
