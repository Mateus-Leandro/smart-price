import { ChangeDetectorRef, Component } from '@angular/core';
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
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loading = false;
  loginFormGroup: FormGroup;
  matcher = new LoginErrorStateMatcher();

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
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
}
