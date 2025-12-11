import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { CompanyRegisterForm } from '../../components/company-register-form/company-register-form';
import { UserRegisterForm } from '../../components/user-register-form/user-register-form';
import { Router } from '@angular/router';
import { Button } from 'src/app/shared/components/button/button';
import { NgForm } from '@angular/forms';
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
  styleUrl: './register.scss',
})
export class Register {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  nextTab(tabs: MatTabGroup, companyFormRef: any) {
    const companyForm = companyFormRef.form;

    if (companyForm.invalid) {
      companyForm.control.markAllAsTouched();
      return;
    }

    tabs.selectedIndex = 1;
  }

  returnToLogin() {
    this.router.navigate(['/login']);
  }

  async registerNewUser(userForm: NgForm, companyForm: NgForm) {
    let invalid = false;

    if (companyForm.invalid) {
      invalid = true;
      companyForm.control.markAllAsTouched();
    }

    if (userForm.invalid) {
      userForm.control.markAllAsTouched();
    }

    if (invalid) return;

    const companyFormValues = companyForm.value;
    const userFormValues = userForm.value;

    const newUser: ICreateCompanyUser = {
      company: {
        cnpj: companyFormValues.cnpj,
        name: companyFormValues.corporateReason,
      },
      user: {
        name: userFormValues.name,
        email: userFormValues.email,
        password: userFormValues.pass,
      },
    };

    try {
      const { user } = await this.authService.register(newUser);
      if (user) {
        await this.authService.login(user.email, newUser.user.password);
      }
      return;
    } catch (error) {
      throw error;
    }
  }
}
