import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogRef } from '@angular/material/dialog';

import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { DatePicker } from 'src/app/shared/components/date-picker/date-picker';

export interface PrincingRecordsFormData {
  name: string;
  creationDate: string;
}

@Component({
  selector: 'app-princing-records-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FlexLayoutModule,
    DatePicker,
  ],
  templateUrl: './princing-records-form.html',
  styleUrl: './princing-records-form.scss',
})
export class PrincingRecordsForm {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PrincingRecordsForm>,
    @Inject(MAT_DIALOG_DATA) public data: PrincingRecordsFormData
  ) {
    this.form = this.fb.group({
      name: [data.name || '', Validators.required],
      creationDate: [data.creationDate || null, Validators.required],
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.value);
    this.dialogRef.close(this.form.value);
  }
}
