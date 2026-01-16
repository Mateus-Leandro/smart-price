import { Component, Inject, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingService } from 'src/app/core/services/loading.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatInputModule } from '@angular/material/input';
import { Button } from 'src/app/shared/components/button/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { PasswordMatchValidator } from 'src/app/shared/validators/password-match.validator';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-user-password-change-dialog',
  imports: [
    Spinner,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    Button,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  templateUrl: './user-password-change-dialog.html',
  styleUrl: './user-password-change-dialog.scss',
})
export class UserPasswordChangeDialog {
  userPasswordChangeGroup: FormGroup;
  loading = inject(LoadingService).loading;
  actualPasswordVisibile = signal(false);
  newPasswordVisibile = signal(false);
  confirmationPasswordVisibile = signal(false);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserPasswordChangeDialog>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public email: string,
  ) {
    this.userPasswordChangeGroup = this.fb.group(
      {
        actualPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmationPass: ['', [Validators.required]],
      },
      { validators: [PasswordMatchValidator.match('newPassword', 'confirmationPass')] },
    );

    this.newPassword.valueChanges.subscribe(() => {
      this.confirmationPass.updateValueAndValidity({ onlySelf: true });
    });
  }

  submit() {
    if (this.userPasswordChangeGroup.invalid) return;
    this.authService
      .login(this.email, this.actualPassword.value)
      .pipe(
        switchMap(() => {
          return this.authService.updateUser({
            password: this.confirmationPass.value,
          });
        }),
      )
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.log('Erro ao alterar senha', err);
        },
      });
  }

  cancel() {
    this.dialogRef.close();
  }

  get actualPassword() {
    return this.userPasswordChangeGroup.get('actualPassword')!;
  }

  get newPassword() {
    return this.userPasswordChangeGroup.get('newPassword')!;
  }

  get confirmationPass() {
    return this.userPasswordChangeGroup.get('confirmationPass')!;
  }

  changeVisibilityInputPass(inputPass: WritableSignal<boolean>) {
    inputPass.update((v) => !v);
  }
}
