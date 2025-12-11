import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordMatchValidator } from 'src/app/shared/validators/password-match.validator';

@Component({
  selector: 'app-user-register-form',
  standalone: true,
  imports: [FlexLayoutModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './user-register-form.html',
})
export class UserRegisterForm {
  @Output() submitForm = new EventEmitter<FormGroup>();

  userFormGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userFormGroup = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
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
