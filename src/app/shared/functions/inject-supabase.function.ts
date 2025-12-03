import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

export const injectSupabase = () => {
  const supabaseService = inject(SupabaseService);
  return supabaseService.supabase;
};
