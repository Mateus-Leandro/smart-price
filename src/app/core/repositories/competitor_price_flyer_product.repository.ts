import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { from, map } from 'rxjs';
import {
  IDeleteCompetitorPriceFlyerProduct,
  IUpsertCompetitorPriceFlyerProduct,
} from '../models/competitor_price_flyer_products.model';

@Injectable({ providedIn: 'root' })
export class CompetitorPriceFlyerProductRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  upsertCompetitorPriceFlyerProduct(
    competitorPriceFlyerProduct: IUpsertCompetitorPriceFlyerProduct,
  ) {
    return from(
      this.supabase
        .from('competitor_price_flyer_products')
        .upsert(
          {
            company_id: competitorPriceFlyerProduct.companyId,
            product_id: competitorPriceFlyerProduct.productId,
            promotional_flyer_id: competitorPriceFlyerProduct.promotionalFlyerId,
            competitor_id: competitorPriceFlyerProduct.competitorId,
            price: competitorPriceFlyerProduct.price,
          },
          {
            onConflict: 'product_id, company_id, competitor_id',
          },
        )
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
    );
  }

  deleteCompetitorPriceFlyerProduct(
    deleteCompetitorPriceFlyerProduct: IDeleteCompetitorPriceFlyerProduct,
  ) {
    return from(
      this.supabase
        .from('competitor_price_flyer_products')
        .delete()
        .eq('product_id', deleteCompetitorPriceFlyerProduct.productId)
        .eq('competitor_id', deleteCompetitorPriceFlyerProduct.competitorId)
        .eq('company_id', deleteCompetitorPriceFlyerProduct.companyId)
        .eq('promotional_flyer_id', deleteCompetitorPriceFlyerProduct.promotionalFlyerId),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
    );
  }
}
