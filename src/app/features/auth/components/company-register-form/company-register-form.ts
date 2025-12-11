import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-company-register-form',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './company-register-form.html',
})
export class CompanyRegisterForm {
  companyFormGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.companyFormGroup = this.fb.group({
      cnpj: ['', Validators.required],
      corporateReason: ['', Validators.required],
      fantasyName: [''],
    });
  }

  get cnpj() {
    return this.companyFormGroup.get('cnpj')!;
  }

  get corporateReason() {
    return this.companyFormGroup.get('corporateReason')!;
  }

  get fantasyName() {
    return this.companyFormGroup.get('fantasyName')!;
  }
}
