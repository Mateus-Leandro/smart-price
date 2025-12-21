import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { PromotionalFlyerProducts } from '../interfaces/promotional-flyer.interface';

@Injectable({
  providedIn: 'root',
})
export class PromotionalFlyerService {
  constructor(private supabaseService: SupabaseService) {}
  async loadFlyers() {
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

  async loadProducts(
    flyerId: number,
    pageIndex: number,
    pageSize: number,
  ): Promise<{ data: PromotionalFlyerProducts[]; count: number }> {
    const from = pageIndex * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await this.supabaseService.supabase
      .from('promotional_flyer_products')
      .select(
        `
      id,
      products (
        id,
        name
      )
      `,
        { count: 'exact' },
      )
      .eq('promotional_flyer_id', flyerId)
      .order('id', { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    return {
      data: (data ?? []).map((item: any) => ({
        id: item.products.id,
        name: item.products.name,
      })),
      count: count ?? 0,
    };
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }
}
