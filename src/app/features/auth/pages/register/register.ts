import { Component } from '@angular/core';
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
import { ICreateCompanyUser } from 'src/app/shared/interfaces/company-user-interface';

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

  async registerNewUser(userForm: FormGroup, companyForm: FormGroup) {
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

    if (userForm.invalid || companyForm.invalid) return;

    const invalidCompany = companyForm.invalid;
    const invalidUser = userForm.invalid;

    if (invalidCompany) companyForm.markAllAsTouched();
    if (invalidUser) userForm.markAllAsTouched();
    if (invalidCompany || invalidUser) return;

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

    try {
      this.loading = true;
      const { user } = await this.authService.register(newUser);

      if (user) {
        await this.authService.login(user.email, newUser.user.password);
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      this.loading = false;
    }
  }
}
