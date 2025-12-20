import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/features/auth/services/auth.service';

export const guestGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (await authService.isLogged()) {
    router.navigate(['/promotional_flyer']);
    return false;
  }

  return true;
};
