import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { IPromotionalFlyerProducts } from '../../../shared/interfaces/promotional-flyer.interface';
import { IDefaultPaginatorDataSource } from 'src/app/shared/interfaces/query-interface';

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
    paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerProducts>,
    search?: string,
  ): Promise<{ data: IPromotionalFlyerProducts[]; count: number }> {
    const from = paginatorDataSource.pageIndex * paginatorDataSource.pageSize;
    const to = from + paginatorDataSource.pageSize - 1;

    let query = this.supabaseService.supabase
      .from('promotional_flyer_products')
      .select(
        `
      id,
      products!inner (
        id,
        name
      )
      `,
        { count: 'exact' },
      )
      .eq('promotional_flyer_id', flyerId)
      .order('products(name)', { ascending: true });

    if (search) {
      query.ilike('products.name', `%${search}%`);
    }

    const { data, count, error } = await query.range(from, to);

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
