import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { PasswordMatchValidator } from 'src/app/shared/validators/password-match.validator';
import { UserService } from '../../services/user.service';

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
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
  ) {
    this.userFormGroup = this.fb.group(
      {
        id: [''],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(35)]],
        pass: ['', [Validators.required, Validators.minLength(6)]],
        confirmationPass: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: [PasswordMatchValidator.match('pass', 'confirmationPass')] },
    );

    this.pass.valueChanges.subscribe(() => {
      this.confirmationPass.updateValueAndValidity({ onlySelf: true });
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.userId = this?.route?.snapshot?.paramMap?.get('id');
    if (this.userId) {
      this.userService.getUserInfoByUserId(this.userId).subscribe((user) => {
        this.userFormGroup.patchValue({
          id: this.userId,
          email: user.email,
          name: user.name,
        });
        this.userFormGroup.get('pass')?.disable();
        this.userFormGroup.get('confirmationPass')?.disable();
      });
    }
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
