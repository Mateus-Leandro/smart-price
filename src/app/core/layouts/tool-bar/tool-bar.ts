import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { User } from '@supabase/supabase-js';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';

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
  ) {}
  @Output() menuClick = new EventEmitter<void>();

  async ngOnInit() {
    await this.loadUser();
  }

  async loadUser() {
    try {
      this.user = await this.authService.getUser();
    } catch (error) {
      console.error('Usuário não autenticado na Toolbar', error);
    } finally {
      this.cdr.detectChanges();
    }
  }
}
