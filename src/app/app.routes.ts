import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { MainLayout } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'promotional_flyer', pathMatch: 'full' },
      {
        path: 'promotional_flyer',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/promotional_flyer/pages/promotional-flyer/promotional-flyer').then(
            (m) => m.PromotionalFlyer,
          ),
      },
      {
        path: 'promotional_flyer/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/promotional_flyer/pages/promotional-flyer-products/promotional-flyer-products').then(
            (m) => m.PromotionalFlyerProducts,
          ),
      },
    ],
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('../app/features/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../app/features/auth/pages/register/register').then((m) => m.Register),
  },
];
