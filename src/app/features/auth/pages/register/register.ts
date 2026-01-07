import { ChangeDetectorRef, Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { CompanyRegisterForm } from '../../components/company-register-form/company-register-form';
import { UserRegisterForm } from '../../components/user-register-form/user-register-form';
import { Router } from '@angular/router';
import { Button } from 'src/app/shared/components/button/button';
import { FormGroup, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ICreateCompanyUser } from 'src/app/core/models/auth.model';

@Component({
  selector: 'app-register',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    CompanyRegisterForm,
    UserRegisterForm,
    Button,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}
  loading = false;

  nextTab(tabs: MatTabGroup, companyForm: FormGroup) {
    if (companyForm.invalid) {
      companyForm.markAllAsTouched();
      return;
    }
    tabs.selectedIndex = 1;
  }
  returnToLogin() {
    this.router.navigate(['/login']);
  }

  registerNewUser(userForm: FormGroup, companyForm: FormGroup) {
    let invalid = false;
    if (companyForm.invalid) {
      invalid = true;
      companyForm.markAllAsTouched();
    }

    if (userForm.invalid) {
      invalid = true;
      userForm.markAllAsTouched();
    }

    if (invalid) return;

    const newUser: ICreateCompanyUser = {
      company: {
        cnpj: companyForm.value.cnpj,
        name: companyForm.value.corporateReason,
      },
      user: {
        name: userForm.get('name')?.value,
        email: userForm.get('email')?.value,
        password: userForm.get('pass')?.value,
      },
    };

    this.authService
      .register(newUser)
      .pipe()
      .subscribe({
        next: (user) => {
          this.authService
            .login(user.email, newUser.user.password)
            .pipe()
            .subscribe({
              next: () => {
                this.router.navigate(['/promotional_flyer']);
              },
              error: (err) => {
                console.log('Erro ao realizar login:', err);
                this.cdr.detectChanges();
                throw new Error(err);
              },
            });
        },
        error: (err) => {
          console.log('Erro ao criar usuário:', err);
          this.cdr.detectChanges();
          throw new Error(err);
        },
      });
  }
}
