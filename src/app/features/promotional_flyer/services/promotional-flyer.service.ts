import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/shared/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class PromotionalFlyerService {
  constructor(private supabaseService: SupabaseService) {}
  async loadRecords() {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from('promotional_flyers')
        .select(
          `
          id,
          name,
          finished,
          created_at
        `,
        )
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        createdDate: this.formatDate(item.created_at),
        status: item.finished ? 'Encerrada' : 'Em andamento',
      }));
    } catch (err) {
      throw err;
    }
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }
}
