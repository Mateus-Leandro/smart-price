import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('../app/features/auth/pages/login/login').then((m) => m.Login),
  },

  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../app/features/pricing-records/pages/pricing-records-list/pricing-records-list').then(
        (m) => m.PricingRecordsList,
      ),
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
