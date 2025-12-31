import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCard, MatCardHeader, MatCardActions, MatCardModule } from '@angular/material/card';

import { ForgotPasswordForm } from '../../components/forgot-password-form/forgot-password-form';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FlexLayoutModule,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardModule,
    ForgotPasswordForm,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {}
