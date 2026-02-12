import { Component, inject, ViewChild } from '@angular/core';
import { UserForm } from '../../components/user-form/user-form';
import {
  MatCard,
  MatCardTitle,
  MatCardHeader,
  MatCardContent,
  MatCardActions,
  MatCardSubtitle,
} from '@angular/material/card';
import { Button } from 'src/app/shared/components/button/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup } from '@angular/forms';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { LoadingService } from 'src/app/core/services/loading.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@supabase/supabase-js';
import { NotificationService } from 'src/app/core/services/notification.service';
import { IUserPermission } from 'src/app/core/models/user-permission.model';
import { UserPermissionService } from 'src/app/features/user-permission/user-permission.service';

@Component({
  selector: 'app-register-user',
  imports: [
    FlexLayoutModule,
    UserForm,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    Button,
    Spinner,
    MatCardSubtitle,
  ],
  templateUrl: './register-user.html',
})
export class RegisterUser {
  @ViewChild('userFormRef') userFormRef!: UserForm;
  loggedUserInfo!: User;
  loading = inject(LoadingService).loading;
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private userPermissionService: UserPermissionService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.loggedUserInfo = user;
      },
    });
  }

  createOrUpdateUser(userForm: FormGroup) {
    if (userForm.invalid) {
      userForm.markAllAsTouched();
      return;
    }

    const user = {
      name: userForm?.value?.name,
      email: userForm?.value?.email,
      password: userForm?.value.pass,
    };

    const userId = userForm?.getRawValue()?.id;

    if (userId) {
      this.userService.updateUserName(user.name, userId).subscribe({
        error: (err) => {
          this.notificationService.showError(`Erro ao atualizar usuário: ${err.message || err}`);
        },
      });

      this.userService
        .updateUserCredentials({
          userId,
          email: user.email,
          password: user.password,
        })
        .subscribe({
          next: () => {
            this.upsertUserPermissions(userForm);
            this.notificationService.showSuccess(`Usuário atualizado com sucesso!`);
          },
          error: (err) => {
            this.notificationService.showError(
              `Erro ao atualizar credenciais: ${err.message || err}`,
            );
          },
        });

      return;
    }

    if (!this?.loggedUserInfo?.app_metadata['company_id']) {
      throw new Error('Não encontrado companyid para criação do usuário!');
    }

    this.authService
      .createUser({
        user: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
        company: {
          id: this?.loggedUserInfo?.app_metadata['company_id'],
        },
      })
      .subscribe({
        next: (data) => {
          const userId = data.user.id;
          userForm.controls['id'].setValue(userId);
          this.upsertUserPermissions(userForm);
          this.notificationService.showSuccess(`Usuário criado com sucesso`);
        },
        error: (err) => {
          this.notificationService.showError(`Erro ao criar usuário: ${err.message || err}`);
        },
      });
  }

  upsertUserPermissions(userForm: FormGroup) {
    const userPermissions: IUserPermission = {
      userId: userForm?.getRawValue()?.id,
      isAdmin: userForm?.value?.isAdmin,
      allowEditPrices: userForm?.getRawValue()?.allowEditPrices,
      allowEditCompetitorPrices: userForm?.getRawValue()?.allowEditCompetitorPrices,
      allowEditShippingValue: userForm?.getRawValue()?.allowEditShippingValue,
      allowEditProductMargin: userForm?.getRawValue()?.allowEditProductMargin,
      allowEditShippingType: userForm?.getRawValue()?.allowEditShippingType,
      allowSendToErp: userForm?.getRawValue()?.allowSendToErp,
    };

    this.userPermissionService.upsertPermissions(userPermissions).subscribe({
      next: () => {
        this.returnToUsers();
      },
      error: (err) => {
        this.notificationService.showError(
          `Erro ao atualizar permissões do usuário usuário: ${err.message || err}`,
        );
      },
    });
  }

  returnToUsers() {
    this.router.navigate(['/users']);
  }
}
