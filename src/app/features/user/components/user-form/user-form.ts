import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { PasswordMatchValidator } from 'src/app/shared/validators/password-match.validator';

@Component({
  selector: 'app-user-form',
  imports: [
    FlexLayoutModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatLabel,
    MatIconModule,
  ],
  templateUrl: './user-form.html',
})
export class UserForm {
  @Output() submitForm = new EventEmitter<FormGroup>();

  userFormGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userFormGroup = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(35)]],
        pass: ['', [Validators.required, Validators.minLength(6)]],
        confirmationPass: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: [PasswordMatchValidator.match('pass', 'confirmationPass')] },
    );

    this.pass.valueChanges.subscribe(() => {
      this.confirmationPass.updateValueAndValidity({ onlySelf: true });
    });
  }

  onSubmit() {
    this.userFormGroup.markAllAsTouched();
    if (this.userFormGroup.invalid) return;

    this.submitForm.emit(this.userFormGroup);
  }

  get name() {
    return this.userFormGroup.get('name')!;
  }
  get email() {
    return this.userFormGroup.get('email')!;
  }
  get pass() {
    return this.userFormGroup.get('pass')!;
  }
  get confirmationPass() {
    return this.userFormGroup.get('confirmationPass')!;
  }
}
