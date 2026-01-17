import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { User } from '@supabase/supabase-js';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-tool-bar',
  imports: [MatToolbarModule, MatIconModule, IconButton],
  templateUrl: './tool-bar.html',
  styleUrl: '../../../global/styles/_toolbar.scss',
})
export class ToolBar {
  user: User | null = null;
  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {}
  @Output() menuClick = new EventEmitter<void>();

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.authService
      .getUser()
      .pipe()
      .subscribe({
        next: (user) => {
          this.user = user;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.notificationService.showError(`Erro ao obter usuário: ${err.message || err}`);
        },
      });
  }
}
