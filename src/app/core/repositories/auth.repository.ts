import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, map } from 'rxjs';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { ICreateCompanyUser } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  private supabase: SupabaseClient;
  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.supabase;
  }

  login(email: string, password: string) {
    return from(
      this.supabase.auth.signInWithPassword({
        email,
        password,
      }),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  logout() {
    return from(this.supabase.auth.signOut()).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  register(companyUser: ICreateCompanyUser) {
    return from(
      this.supabase.functions.invoke('create-enterprise-user', {
        method: 'POST',
        body: JSON.stringify(companyUser),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
    );
  }

  sendPasswordResetEmail(email: string) {
    return from(
      this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://smart-price-omega.vercel.app/forgot_password',
      }),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  updatePassword(pass: string) {
    return from(
      this.supabase.auth.updateUser({
        password: pass,
      }),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  getUser() {
    return from(this.supabase.auth.getUser()).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        return data.user;
      }),
    );
  }

  isLogged() {
    return from(this.supabase.auth.getSession()).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        return !!data.session;
      }),
    );
  }
}
