import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import {
  IPromotionalflyer,
  IPromotionalFlyerProducts,
} from '../../../shared/interfaces/promotional-flyer.interface';
import { IDefaultPaginatorDataSource } from 'src/app/shared/interfaces/query-interface';

@Injectable({
  providedIn: 'root',
})
export class PromotionalFlyerService {
  constructor(private supabaseService: SupabaseService) {}
  async loadFlyers(
    paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalflyer>,
    search?: string,
  ) {
    try {
      const from = paginatorDataSource.pageIndex * paginatorDataSource.pageSize;
      const to = from + paginatorDataSource.pageSize - 1;

      let query = this.supabaseService.supabase
        .from('promotional_flyers')
        .select(
          `
        id,
        name,
        finished,
        created_at,
        promotional_flyer_products(count)
      `,
          { count: 'exact' },
        )
        .order('created_at', { ascending: false });

      if (search) {
        query.ilike('name', `%${search}%`);
      }

      const { data, count, error } = await query.range(from, to);

      if (error) throw error;

      return {
        data: (data ?? []).map((item) => ({
          id: item.id,
          name: item.name,
          createdDate: this.formatDate(item.created_at),
          status: item.finished ? 'Encerrada' : 'Em andamento',
          totalProducts: item.promotional_flyer_products?.[0]?.count ?? 0,
        })),
        count: count ?? 0,
      };
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
      sale_price,
      quote_cost,
      current_cost_price,
      current_sale_price,
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
        salePrice: item?.sale_price ?? 0,
        quoteCost: item?.quote_cost ?? 0,
        currentCostPrice: item?.current_cost_price ?? 0,
        currentSalePrice: item?.current_sale_price ?? 0,
      })),
      count: count ?? 0,
    };
  }

  async updateSalePrice(flyerId: number, productId: number, salePrice: number): Promise<void> {
    try {
      const { error } = await this.supabaseService.supabase
        .from('promotional_flyer_products')
        .update({
          sale_price: salePrice,
          updated_at: new Date(),
        })
        .eq('promotional_flyer_id', flyerId)
        .eq('product_id', productId);
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Erro ao atualizar preço de venda:', err);
      throw err;
    }
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }

  async sendPricesToErp(flyerId: number, productId?: number) {
    try {
      let query = this.supabaseService.supabase
        .from('promotional_flyer_products')
        .update({
          send_to_erp: true,
          updated_at: new Date(),
        })
        .eq('promotional_flyer_id', flyerId)
        .gt('sale_price', 0);

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { error } = await query;
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Erro ao enviar preços para o ERP:', error);
      throw error;
    }
  }
}
