import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Button } from 'src/app/shared/components/button/button';
import { AuthService } from '../../services/auth.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NotificationService } from 'src/app/core/services/notification.service';

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
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data?: string,
  ) {
    this.forgotPasswordFormGroup = this.fb.group({
      email: [this?.data || '', [Validators.required, Validators.email]],
    });

    if (this.data) {
      this.email.disable();
    }
  }

  submit() {
    if (this.forgotPasswordFormGroup.invalid) return;

    const email = this.forgotPasswordFormGroup.value.email;

    this.authService
      .sendPasswordResetEmail(email)
      .pipe()
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            `Enviado link para recuperação da senha no email: ${email}`,
          );
          this.cancel();
        },
        error: (err) => {
          this.notificationService.showError(
            `Erro ao enviar link para recuperação da senha: ${err.message || err}`,
          );
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
