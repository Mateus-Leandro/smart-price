import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { MainLayout } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../app/features/pricing-records/pages/pricing-records-list/pricing-records-list').then(
            (m) => m.PricingRecordsList,
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
