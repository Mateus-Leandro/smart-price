import { ErrorStateMatcher } from '@angular/material/core';
import { FormGroupDirective, NgForm } from '@angular/forms';

export class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: any, form: FormGroupDirective | NgForm | null): boolean {
    return !!(
      control &&
      control.touched &&
      (control.invalid || control.parent?.hasError('invalidCredential'))
    );
  }
}
