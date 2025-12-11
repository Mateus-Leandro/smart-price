import { Component, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-company-register-form',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './company-register-form.html',
})
export class CompanyRegisterForm {
  @ViewChild('companyForm') form?: NgForm;
  cnpj = '';
  corporateReason = '';
}
