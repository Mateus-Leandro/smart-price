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

  async login(email: string, password: string) {
    try {
      await firstValueFrom(this.repository.login(email, password));
      this.router.navigate(['/promotional_flyer']);
    } catch (error) {
      console.log(`Erro ao realizar login: `, error);
    }
  }

  async logout() {
    try {
      await firstValueFrom(this.repository.logout());
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(`Erro ao realizar logout: `, error);
    }
  }

  async register(user: ICreateCompanyUser) {
    try {
      return await firstValueFrom(this.repository.register(user));
    } catch (error) {
      throw `Erro ao criar usuário: ${error}`;
    }
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
}
