import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Button } from 'src/app/shared/components/button/button';
import { CommonModule } from '@angular/common';
import { LoginErrorStateMatcher } from 'src/app/shared/matchers/login-error-state-matcher';
import { MatIconModule } from '@angular/material/icon';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordDialog } from '../../components/forgot-password-dialog/forgot-password-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatInputModule,
    FormsModule,
    Button,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    IconButton,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loading = false;
  loginFormGroup: FormGroup;
  matcher = new LoginErrorStateMatcher();
  passwordVisible = signal(false);

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onSubmit() {
    const passwordCtrl = this.loginFormGroup.get('password');
    passwordCtrl?.setErrors(null);

    this.loginFormGroup.markAllAsTouched();
    if (this.loginFormGroup.invalid) return;

    this.loading = true;

    try {
      await this.authService.login(
        this.loginFormGroup.value.email,
        this.loginFormGroup.value.password,
      );
    } catch (error) {
      this.loginFormGroup.setErrors({ invalidCredential: true });
      this.loginFormGroup.markAllAsTouched();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  get email() {
    return this.loginFormGroup.get('email')!;
  }
  get password() {
    return this.loginFormGroup.get('password')!;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((v) => !v);
  }

  openForgotPasswordDialog(): void {
    this.dialog.open(ForgotPasswordDialog, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
