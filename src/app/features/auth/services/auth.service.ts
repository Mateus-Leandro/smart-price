import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../shared/services/supabase.service';
import { Router } from '@angular/router';
import { ICreateCompanyUser } from 'src/app/shared/interfaces/company-user-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
  ) {}

  async login(email: string, password: string) {
    const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw `Erro ao realizar login: ${error}`;
    this.router.navigate(['/promotional_flyer']);
  }

  async logout() {
    const { error } = await this.supabaseService.supabase.auth.signOut();
    if (error) throw `Erro ao realizar logout: ${error}`;

    this.router.navigate(['/login']);
  }

  async register(user: ICreateCompanyUser) {
    try {
      return await this.callPostEdgeFunction('create-enterprise-user', user);
    } catch (error) {
      throw `Erro ao criar usuário: ${error}`;
    }
  }

  async sendPasswordResetEmail(email: string) {
    const { error } = await this.supabaseService.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://smart-price-omega.vercel.app/forgot_password',
    });
    if (error) throw `Erro ao resetar senha: ${error}`;
  }

  async isLogged() {
    const { data } = await this.supabaseService.supabase.auth.getSession();
    return !!data.session;
  }

  async getUser() {
    return await this.supabaseService.supabase.auth.getUser();
  }

  async updatePassword(pass: string) {
    return await this.supabaseService.supabase.auth.updateUser({
      password: pass,
    });
  }

  private async callPostEdgeFunction(functionName: string, body: any) {
    const { data, error } = await this.supabaseService.supabase.functions.invoke(functionName, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (error) throw error;
    return data;
  }
}
