import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  companyId: number = 0;
  loading = inject(LoadingService).loading;
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.authService.getCompanyIdFromLoggedUser().subscribe({
      next: (id) => {
        this.companyId = id;
      },
    });
  }

  createOrUpdateUser(userForm: FormGroup) {
    if (userForm.invalid) {
      userForm.markAllAsTouched();
      return;
    }

    const userId: string | null = userForm?.value?.id;
    const user = {
      name: userForm?.value?.name,
      email: userForm?.value?.email,
      password: userForm?.value.pass,
    };

    if (userId) {
      this.userService.updateUserName(user.name, userId).subscribe({
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
      if (!this.companyId) throw new Error('Não encontrado companyid para criação do usuário!');

      this.authService
        .createUser({
          user: {
            name: user.name,
            email: user.email,
            password: user.password,
          },
          company: {
            id: this.companyId,
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

  returnToUsers() {
    this.router.navigate(['/users']);
  }
}
