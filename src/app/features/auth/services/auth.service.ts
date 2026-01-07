import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ICreateCompanyUser } from 'src/app/core/models/auth.model';
import { AuthRepository } from 'src/app/core/repositories/auth.repository';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private repository: AuthRepository,
  ) {}

  login(email: string, password: string) {
    return this.repository.login(email, password);
  }

  logout() {
    return this.repository.logout();
  }

  register(user: ICreateCompanyUser) {
    return this.repository.register(user);
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

  updatePassword(pass: string) {
    return this.repository.updatePassword(pass);
  }

  getCompanyIdFromLoggedUser() {
    return this.repository.getCompanyId();
  }
}
