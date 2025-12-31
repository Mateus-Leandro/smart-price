import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from 'src/app/shared/services/supabase.service';

export const passRecoveryGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const {
    data: { session },
  } = await supabaseService.supabase.auth.getSession();

  const hasRecoveryToken =
    state.url.includes('type=recovery') || state.url.includes('access_token=');

  if (session || hasRecoveryToken) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
