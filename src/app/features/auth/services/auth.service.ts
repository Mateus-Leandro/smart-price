import { Injectable } from '@angular/core';
import {
  ICreateUser,
  IRegisterCompanyAndUser,
  IUpdateUser,
  IUser,
} from 'src/app/core/models/auth.model';
import { AuthRepository } from 'src/app/core/repositories/auth.repository';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private repository: AuthRepository) {}

  login(email: string, password: string) {
    return this.repository.login(email, password);
  }

  logout() {
    return this.repository.logout();
  }

  createUser(user: IRegisterCompanyAndUser | ICreateUser) {
    return this.repository.createUser(user);
  }

  sendPasswordResetEmail(email: string) {
    return this.repository.sendPasswordResetEmail(email);
  }

  async isLogged() {
    return await firstValueFrom(this.repository.isLogged());
  }

  getUser() {
    return this.repository.getUser();
  }

  updateUser(updateUser: IUpdateUser) {
    return this.repository.updateUser(updateUser);
  }

  getCompanyIdFromLoggedUser() {
    return this.repository.getCompanyId();
  }
}
