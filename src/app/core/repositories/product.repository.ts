import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import { map, from, Observable } from 'rxjs';
import { IProductView } from '../../features/product/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductRepository {
  private supabase: SupabaseClient;
  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.supabase;
  }

  getProducts(
    paginator: IDefaultPaginatorDataSource<IProductView>,
    search?: string,
  ): Observable<{ data: IProductView[]; count: number }> {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;

    let query = this.supabase
      .from('products')
      .select(
        `id,
        name,
        created_at,
        updated_at`,
        { count: 'exact' },
      )
      .order('name', { ascending: true });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    return from(query.range(fromIdx, toIdx)).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const mappedData: any[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        return { data: mappedData, count: count ?? 0 };
      }),
    );
  }
}
