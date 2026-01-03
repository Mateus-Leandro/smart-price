import { Component } from '@angular/core';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { ToolBar } from '../tool-bar/tool-bar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { IItensMenuDrawer } from '../../models/menu-drawer.model';

@Component({
  selector: 'app-main-layout',
  imports: [
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    ToolBar,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatIcon,
    FlexLayoutModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  constructor(private authService: AuthService) {}

  navItemsMenuDrawer: IItensMenuDrawer[] = [
    {
      router: '/promotional_flyer',
      textNav: 'Precificação',
      icon: 'attach_money',
    },
    {
      router: '/products',
      textNav: 'Produtos',
      icon: 'shopping_cart',
    },
  ];

  logout() {
    this.authService.logout();
  }
}
