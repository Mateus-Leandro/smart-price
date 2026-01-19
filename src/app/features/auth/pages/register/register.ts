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
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IRegisterCompanyAndUser } from 'src/app/core/models/auth.model';
import { NotificationService } from 'src/app/core/services/notification.service';

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
    private notificationService: NotificationService,
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

    const newUser: IRegisterCompanyAndUser = {
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

    this.loading = true;
    this.authService
      .createUser(newUser)
      .pipe()
      .subscribe({
        next: (response) => {
          this.authService.login(response.data.user.email, newUser.user.password).subscribe({
            next: () => {
              this.router.navigate(['/promotional_flyer']);
            },
            error: (err) => {
              this.notificationService.showError(
                `Não foi possível realizar o login: ${err.message || err}`,
              );
              this.cdr.detectChanges();
            },
          });
        },
        error: (err) => {
          this.notificationService.showError(`Erro ao criar usuário: ${err.message || err}`);
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }
}
