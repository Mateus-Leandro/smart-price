import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { PasswordMatchValidator } from 'src/app/shared/validators/password-match.validator';
import { Button } from 'src/app/shared/components/button/button';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password-form',
  imports: [
    MatFormField,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    Button,
    Spinner,
  ],
  templateUrl: './forgot-password-form.html',
  styleUrl: './forgot-password-form.scss',
})
export class ForgotPasswordForm {
  forgotPasswordFormGroup: FormGroup;
  loading = false;
  loadingForgotPassword = false;
  email? = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.forgotPasswordFormGroup = this.fb.group(
      {
        pass: ['', Validators.required],
        confirmationPass: ['', Validators.required],
      },
      { validators: [PasswordMatchValidator.match('pass', 'confirmationPass')] },
    );

    this.pass.valueChanges.subscribe(() => {
      this.confirmationPass.updateValueAndValidity({ onlySelf: true });
    });
  }

  async ngOnInit() {
    this.loading = true;
    try {
      const user = await this.authService.getUser();
      this.email = user?.email;
    } catch (error) {
      console.log('Erro ao carregar usuário', error);
    } finally {
      this.loading = false;
    }
  }

  get pass() {
    return this.forgotPasswordFormGroup.get('pass')!;
  }

  get confirmationPass() {
    return this.forgotPasswordFormGroup.get('confirmationPass')!;
  }

  async onSubmit() {
    this.forgotPasswordFormGroup.markAllAsTouched();
    if (this.forgotPasswordFormGroup.invalid || !this.email) return;
    this.loadingForgotPassword = true;
    try {
      await this.authService.updatePassword(this.confirmationPass.value);
    } catch (error) {
      console.error('Erro ao resetar senha: ', error);
    } finally {
      this.loadingForgotPassword = false;
      this.returnToLoginPage();
    }
  }

  returnToLoginPage() {
    this.router.navigate(['/login']);
  }
}
