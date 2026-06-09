import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import { map, from, Observable, finalize, of, switchMap } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { IProductView } from '../models/product.model';
import { MarginFilterEnum } from '../enums/product.enum';
import { IProductReportView } from 'src/app/core/models/product-report.model';

@Injectable({ providedIn: 'root' })
export class ProductRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  getProducts(
    paginator: IDefaultPaginatorDataSource<IProductView>,
    marginFilter: MarginFilterEnum,
    search?: string,
  ): Observable<{ data: IProductView[]; count: number }> {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;
    const query = this.buildProductsQuery(marginFilter, search);
    this.loadingService.show();
    return from(query.range(fromIdx, toIdx)).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const mappedData: IProductView[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          marginBranches: item.marginBranches || [],
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        return { data: mappedData, count: count ?? 0 };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  getProductsReport(
    marginFilter: MarginFilterEnum,
    search?: string,
    supplierId?: number,
  ): Observable<IProductReportView[]> {
    this.loadingService.show();

    const productIds$: Observable<number[] | undefined> = supplierId
      ? from(this.fetchSupplierProductIds(supplierId))
      : of(undefined);

    return productIds$.pipe(
      switchMap((productIds) => {
        if (supplierId && !productIds?.length) {
          return of([] as any[]);
        }

        return from(this.fetchAllProductsForReport(marginFilter, search, productIds));
      }),
      map((data) =>
        data.map((item: any) => ({
          id: item.id,
          name: item.name,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          marginBranches: (item.marginBranches || []).map((marginBranch: any) => ({
            brancheId: marginBranch.brancheId,
            brancheName: marginBranch.branche?.name || '',
            margin: marginBranch.margin,
          })),
        })),
      ),
      finalize(() => this.loadingService.hide()),
    );
  }

  private buildProductsQuery(
    marginFilter: MarginFilterEnum,
    search?: string,
    productIds?: number[],
  ) {
    const relationJoin = marginFilter === MarginFilterEnum.WITH_MARGIN ? '!inner' : '';

    let query = this.supabase.from('products').select(
      `id,
      id_text,
      name,
      marginBranches:product_margin_branches${relationJoin} (
        brancheId:branche_id,
        margin,
        branche:company_branches (
          name
        )
      ),
      created_at,
      updated_at`,
      { count: 'exact' },
    );

    if (search) {
      query = query.or(`name.ilike.%${search}%,id_text.ilike.%${search}%`);
    }

    if (productIds) {
      query = query.in('id', productIds);
    }

    if (marginFilter === MarginFilterEnum.WITHOUT_MARGIN) {
      query = query.filter('marginBranches', 'is', 'null');
    }

    return query.order('name', { ascending: true });
  }

  private async fetchAllProductsForReport(
    marginFilter: MarginFilterEnum,
    search?: string,
    productIds?: number[],
  ): Promise<any[]> {
    const pageSize = 1000;
    let fromIdx = 0;
    let hasMore = true;
    const products: any[] = [];

    while (hasMore) {
      const toIdx = fromIdx + pageSize - 1;
      const { data, error } = await this.buildProductsQuery(
        marginFilter,
        search,
        productIds,
      ).range(fromIdx, toIdx);

      if (error) {
        throw error;
      }

      const currentPage = data || [];
      products.push(...currentPage);
      hasMore = currentPage.length === pageSize;
      fromIdx += pageSize;
    }

    return products;
  }

  private async fetchSupplierProductIds(supplierId: number): Promise<number[]> {
    const { data: flyers, error: flyersError } = await this.supabase
      .from('supplier_flyers')
      .select('id')
      .eq('supplier_id', supplierId);

    if (flyersError) {
      throw flyersError;
    }

    const flyerIds = (flyers ?? []).map((flyer: any) => flyer.id as number);
    if (!flyerIds.length) {
      return [];
    }

    const { data: flyerProducts, error: flyerProductsError } = await this.supabase
      .from('supplier_flyer_products')
      .select('product_id')
      .in('supplier_flyer_id', flyerIds);

    if (flyerProductsError) {
      throw flyerProductsError;
    }

    return [...new Set((flyerProducts ?? []).map((fp: any) => fp.product_id as number))];
  }
}
