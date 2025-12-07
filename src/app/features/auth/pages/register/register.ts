import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { EnterpriseRegisterForm } from '../../components/enterprise-register-form/enterprise-register-form';
import { UserRegisterForm } from '../../components/user-register-form/user-register-form';

@Component({
  selector: 'app-register',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    EnterpriseRegisterForm,
    UserRegisterForm,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  nextTab(tabs: MatTabGroup) {
    if (tabs.selectedIndex! < tabs._tabs.length - 1) {
      tabs.selectedIndex = tabs.selectedIndex! + 1;
    }
  }
}
