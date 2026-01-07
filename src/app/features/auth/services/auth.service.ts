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

  async sendPasswordResetEmail(email: string) {
    try {
      return await firstValueFrom(this.repository.sendPasswordResetEmail(email));
    } catch (error) {
      throw `Erro ao enviar email de recuperação de senha: ${error}`;
    }
  }

  async isLogged() {
    return await firstValueFrom(this.repository.isLogged());
  }

  async getUser() {
    return await firstValueFrom(this.repository.getUser());
  }

  async updatePassword(pass: string) {
    try {
      return await firstValueFrom(this.repository.updatePassword(pass));
    } catch (error) {
      throw `Erro ao atualizar senha: ${error}`;
    }
  }

  getCompanyIdFromLoggedUser() {
    return this.repository.getCompanyId();
  }
}
