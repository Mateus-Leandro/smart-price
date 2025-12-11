import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordMatchValidator {
  static match(passField: string, confirmationField: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pass = group.get(passField);
      const confirmation = group.get(confirmationField);

      if (!pass || !confirmation) return null;

      if (!confirmation.value) {
        confirmation.setErrors(null);
        return null;
      }

      if (pass.value !== confirmation.value) {
        confirmation.setErrors({ passwordsMismatch: true });
      } else {
        if (confirmation.hasError('passwordsMismatch')) {
          confirmation.setErrors(null);
        }
      }

      return null;
    };
  }
}
