import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Button } from 'src/app/shared/components/button/button';

@Component({
  selector: 'app-tool-bar',
  imports: [MatToolbarModule, MatIconModule, Button],
  templateUrl: './tool-bar.html',
  styleUrl: '../../../global/styles/_toolbar.scss',
})
export class ToolBar {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
