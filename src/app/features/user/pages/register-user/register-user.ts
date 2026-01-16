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
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { MatDialog } from '@angular/material/dialog';
import { UserPasswordChangeDialog } from '../../components/user-password-change-dialog/user-password-change-dialog';
import { User } from '@supabase/supabase-js';
import { ForgotPasswordDialog } from 'src/app/features/auth/components/forgot-password-dialog/forgot-password-dialog';

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
    IconButton,
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
    private dialog: MatDialog,
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

    if (userForm?.value?.id) {
      this.userService.updateUserName(user.name, userForm?.value?.id).subscribe({
        error: (err) => {
          throw new Error(err);
        },
      });

      this.authService
        .updateUser({
          email: user.email,
        })
        .subscribe({
          next: () => {
            this.returnToUsers();
          },
          error: (err) => {
            throw new Error(err);
          },
        });
    } else {
      if (!this?.loggedUserInfo?.app_metadata['company_id'])
        throw new Error('Não encontrado companyid para criação do usuário!');

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
          next: () => {
            this.returnToUsers();
          },
          error: (err) => {
            throw new Error(err);
          },
        });
    }
  }

  openChangePassDialog() {
    this.dialog.open(UserPasswordChangeDialog, {
      minWidth: '600px',
      disableClose: false,
      autoFocus: true,
      data: this.userFormRef?.userFormGroup?.getRawValue()?.email,
    });
  }

  openForgoutPassDialog() {
    this.dialog.open(ForgotPasswordDialog, {
      minWidth: '600px',
      disableClose: false,
      autoFocus: true,
      data: this.userFormRef?.userFormGroup?.getRawValue()?.email,
    });
  }

  returnToUsers() {
    this.router.navigate(['/users']);
  }

  get canChangePassword(): boolean {
    const formId = this.userFormRef?.userFormGroup?.getRawValue()?.id;
    return !!(this.loggedUserInfo && formId === this.loggedUserInfo.id);
  }
}
