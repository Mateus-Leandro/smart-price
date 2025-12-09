import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { EnterpriseRegisterForm } from '../../components/enterprise-register-form/enterprise-register-form';
import { UserRegisterForm } from '../../components/user-register-form/user-register-form';
import { Route, Router } from '@angular/router';
import { Button } from 'src/app/shared/components/button/button';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ICreateEnterpriseUser } from 'src/app/shared/interfaces/enterprise-user-interface';

@Component({
  selector: 'app-register',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    EnterpriseRegisterForm,
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

  nextTab(tabs: MatTabGroup, enterpriseFormRef: any) {
    const enterpriseForm = enterpriseFormRef.form;

    if (enterpriseForm.invalid) {
      enterpriseForm.control.markAllAsTouched();
      return;
    }

    tabs.selectedIndex = 1;
  }

  returnToLogin() {
    this.router.navigate(['/login']);
  }

  async registerNewUser(userForm: NgForm, enterpriseForm: NgForm) {
    let invalid = false;

    if (enterpriseForm.invalid) {
      invalid = true;
      enterpriseForm.control.markAllAsTouched();
    }

    if (userForm.invalid) {
      userForm.control.markAllAsTouched();
    }

    if (invalid) return;

    const enterpriseFormValues = enterpriseForm.value;
    const userFormValues = userForm.value;

    const newUser: ICreateEnterpriseUser = {
      enterprise: {
        cnpj: enterpriseFormValues.cnpj,
        name: enterpriseFormValues.corporateReason,
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
