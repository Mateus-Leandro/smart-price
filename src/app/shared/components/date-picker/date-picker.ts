import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  Validator,
  ValidationErrors,
  AbstractControl,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
} from '@angular/forms';

import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  templateUrl: './date-picker.html',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePicker),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePicker),
      multi: true,
    },
  ],
})
export class DatePicker implements ControlValueAccessor, Validator {
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() label: string = 'Selecione a data';
  @Input() required = false;

  readonly dpFormGroup = new FormGroup({
    selectionDate: new FormControl<Date | null>(null),
  });

  private onChange = (value: Date | null) => {};
  private onTouched = () => {};
  private onValidatorChange = () => {};

  constructor() {
    this.dpFormGroup.get('selectionDate')!.valueChanges.subscribe((value) => {
      this.onChange(value);
      this.onTouched();
      this.onValidatorChange();
    });
  }

  writeValue(value: Date | null): void {
    this.dpFormGroup.get('selectionDate')?.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = this.dpFormGroup.get('selectionDate')?.value;

    if (this.required && !value) {
      return { required: true };
    }

    return null;
  }
}
