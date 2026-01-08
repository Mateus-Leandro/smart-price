import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { passRecoveryGuard } from './core/guards/pass-recovery-guard';

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
          import('./features/promotional-flyer/pages/promotional-flyer/promotional-flyer').then(
            (m) => m.PromotionalFlyer,
          ),
      },
      {
        path: 'promotional_flyer/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/promotional-flyer/pages/promotional-flyer-products/promotional-flyer-products').then(
            (m) => m.PromotionalFlyerProducts,
          ),
      },
      {
        path: 'products',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/product/pages/product-maintenance/product-maintenance').then(
            (m) => m.ProductMaintenance,
          ),
      },
      {
        path: 'users',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/user/pages/user-maintenance/user-maintenance').then(
            (m) => m.UserMaintenance,
          ),
      },
      {
        path: 'users/form',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/user/pages/register-user/register-user').then((m) => m.RegisterUser),
      },
      {
        path: 'users/form/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/user/pages/register-user/register-user').then((m) => m.RegisterUser),
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
  {
    path: 'forgot_password',
    canActivate: [passRecoveryGuard],
    loadComponent: () =>
      import('./features/auth/pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
];
