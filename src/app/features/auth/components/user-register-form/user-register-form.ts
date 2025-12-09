import { Component, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-register-form',
  imports: [FlexLayoutModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './user-register-form.html',
})
export class UserRegisterForm {
  name = '';
  email = '';
  pass = '';
  confirmationPass = '';
  @ViewChild('userForm') form?: NgForm;
}
