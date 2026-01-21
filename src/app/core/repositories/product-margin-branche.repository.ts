import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { from, map } from 'rxjs';
import {
  IDeleteProductMarginBranche,
  IUpserProductMarginBranche,
} from '../models/product-margin.model';

@Injectable({ providedIn: 'root' })
export class ProductMarginBrancheRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  upsertProductMarginBranche(upserProductMarginBranche: IUpserProductMarginBranche) {
    return from(
      this.supabase.from('product_margin_branches').upsert(
        {
          company_id: upserProductMarginBranche.companyId,
          branche_id: upserProductMarginBranche.brancheId,
          product_id: upserProductMarginBranche.productId,
          margin: upserProductMarginBranche.margin,
        },
        {
          onConflict: 'product_id, branche_id, company_id',
        },
      ),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  deleteProductMarginBranche(deleteProductMarginBranche: IDeleteProductMarginBranche) {
    return from(
      this.supabase
        .from('product_margin_branches')
        .delete()
        .eq('product_id', deleteProductMarginBranche.productId)
        .eq('branche_id', deleteProductMarginBranche.brancheId)
        .eq('company_id', deleteProductMarginBranche.companyId),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }
}
