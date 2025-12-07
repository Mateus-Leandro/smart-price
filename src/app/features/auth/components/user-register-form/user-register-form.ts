import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-register-form',
  imports: [FlexLayoutModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './user-register-form.html',
})
export class UserRegisterForm {}
