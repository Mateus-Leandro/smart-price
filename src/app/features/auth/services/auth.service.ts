import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../shared/services/supabase.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async login(email: string, password: string) {
    const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw `Erro ao realizar login: ${error}`;

    return data.user;
  }

  async logout() {
    const { error } = await this.supabaseService.supabase.auth.signOut();
    if (error) throw `Erro ao realizar logout: ${error}`;

    this.router.navigate(['/login']);
  }

  async passworldReset(email: string) {
    const { error } = await this.supabaseService.supabase.auth.resetPasswordForEmail(email);
    if (error) throw `Erro ao resetar senha: ${error}`;
  }

  async isLogged() {
    const { data } = await this.supabaseService.supabase.auth.getSession();
    return !!data.session;
  }
}
