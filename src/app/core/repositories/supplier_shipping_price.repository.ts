import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import {
  ICreateSupplierShippingPrice,
  IDeleteSupplierShippingPrice,
} from '../models/supplier_shipping_price.model';
import { from, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupplierShippingPriceRepository {
  private supabase: SupabaseClient;
  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.supabase;
  }

  upsertSupplierShippingPrice(supplierShippingPrice: ICreateSupplierShippingPrice) {
    return from(
      this.supabase.from('supplier_shipping_price').upsert(
        {
          company_id: supplierShippingPrice.company_id,
          supplier_id: supplierShippingPrice.supplierId,
          product_id: supplierShippingPrice.productId,
          shipping_price: supplierShippingPrice.deliveryCost,
        },
        {
          onConflict: 'product_id, supplier_id, company_id',
        },
      ),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  deleteSupplierShippingPrice(deleteSupplierShippingPrice: IDeleteSupplierShippingPrice) {
    return from(
      this.supabase
        .from('supplier_shipping_price')
        .delete()
        .eq('supplier_id', deleteSupplierShippingPrice.supplierId)
        .eq('product_id', deleteSupplierShippingPrice.productId),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }
}
