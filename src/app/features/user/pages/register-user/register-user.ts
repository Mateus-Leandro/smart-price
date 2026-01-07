import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UserForm } from '../../components/user-form/user-form';
import {
  MatCard,
  MatCardTitle,
  MatCardHeader,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { Button } from 'src/app/shared/components/button/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup } from '@angular/forms';
import { IUser } from 'src/app/core/models/auth.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { LoadingService } from 'src/app/core/services/loading.service';

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
  ],
  templateUrl: './register-user.html',
})
export class RegisterUser {
  companyId: number = 0;
  loading = inject(LoadingService).loading;
  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  createNewUser(userForm: FormGroup) {
    if (userForm.invalid) {
      userForm.markAllAsTouched();
      return;
    }

    const newUser: IUser = {
      name: userForm?.value?.name,
      email: userForm?.value?.email,
      password: userForm?.value.pass,
    };

    this.userService
      .createUser(newUser)
      .pipe()
      .subscribe({
        next: () => {
          this.returnToUsers();
        },
        error: (err) => {
          console.log('Erro ao cria usuário:', err);
          this.cdr.detectChanges();
          throw new Error(err);
        },
      });
  }

  returnToUsers() {
    this.router.navigate(['/users']);
  }
}
