import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Button } from 'src/app/shared/components/button/button';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FlexLayoutModule, MatInputModule, FormsModule, Button, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  async login(form: NgForm) {
    this.loading = true;

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.loading = false;
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
    } catch (error) {
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
