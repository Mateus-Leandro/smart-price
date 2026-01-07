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
          console.log('Erro ao obter usuário: ', err);
          throw new Error(err);
        },
      });
  }
}
