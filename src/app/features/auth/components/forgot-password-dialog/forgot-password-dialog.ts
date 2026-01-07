import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Button } from 'src/app/shared/components/button/button';
import { AuthService } from '../../services/auth.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-forgot-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    Button,
    Spinner,
  ],
  templateUrl: './forgot-password-dialog.html',
})
export class ForgotPasswordDialog {
  forgotPasswordFormGroup: FormGroup;
  loading = inject(LoadingService).loading;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ForgotPasswordDialog>,
    private authService: AuthService,
  ) {
    this.forgotPasswordFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.forgotPasswordFormGroup.invalid) return;

    this.authService
      .sendPasswordResetEmail(this.forgotPasswordFormGroup.value.email)
      .pipe()
      .subscribe({
        next: () => {
          this.cancel();
        },
      });
  }

  cancel() {
    this.dialogRef.close();
  }

  get email() {
    return this.forgotPasswordFormGroup.get('email')!;
  }
}
