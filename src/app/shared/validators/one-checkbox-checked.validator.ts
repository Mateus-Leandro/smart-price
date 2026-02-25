import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const OneCheckboxCheckedValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const isAtLeastOneChecked = Object.keys(group.controls).some(
      (key) => group.get(key)?.value === true,
    );

    return isAtLeastOneChecked ? null : { requireCheck: true };
  };
};
