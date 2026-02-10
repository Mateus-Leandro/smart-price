import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { from, map } from 'rxjs';
import {
  IDeleteCompetitorPriceFlyerProduct,
  IUpsertCompetitorPriceFlyerProduct,
} from '../models/competitor_price_flyer_products.model';

@Injectable({ providedIn: 'root' })
export class CompetitorPriceFlyerProductRepository {
  private supabase: SupabaseClient;
  constructor(private supabaseService: SupabaseService) {
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
            integral_flyer_id: competitorPriceFlyerProduct.integralFlyerId,
            product_id: competitorPriceFlyerProduct.productId,
            competitor_id: competitorPriceFlyerProduct.competitorId,
            company_id: competitorPriceFlyerProduct.companyId,
            price: competitorPriceFlyerProduct.price,
          },
          {
            onConflict: 'integral_flyer_id, product_id, competitor_id, company_id',
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
        .eq('integral_flyer_id', deleteCompetitorPriceFlyerProduct.integralFlyerId)
        .eq('product_id', deleteCompetitorPriceFlyerProduct.productId)
        .eq('competitor_id', deleteCompetitorPriceFlyerProduct.competitorId)
        .eq('company_id', deleteCompetitorPriceFlyerProduct.companyId),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
    );
  }
}
