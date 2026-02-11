import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { LoadingService } from '../services/loading.service';
import { finalize, from, map } from 'rxjs';
import { IUserPermission } from '../models/user-permission.model';

@Injectable({ providedIn: 'root' })
export class UserPermissionRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  upsertUserPermissions(userPermissions: IUserPermission) {
    this.loadingService.show();

    return from(
      this.supabase.from('user_permissions').upsert(
        {
          user_id: userPermissions.userId,
          is_admin: userPermissions.isAdmin,
          allow_edit_competitor_prices: userPermissions.allowEditCompetitorPrices,
          allow_edit_prices: userPermissions.allowEditPrices,
          allow_edit_shipping_value: userPermissions.allowEditShippingValue,
          allow_send_to_erp: userPermissions.allowSendToErp,
          allow_edit_shipping_type: userPermissions.allowEditShippingType,
          allow_edit_product_margin: userPermissions.allowEditProductMargin,
        },
        {
          onConflict: 'user_id',
        },
      ),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  getUserPermissions(userId: string) {
    return from(
      this.supabase.from('user_permissions').select('*').eq('user_id', userId).single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        const mappedData: IUserPermission = {
          userId: userId,
          isAdmin: data.is_admin,
          allowEditCompetitorPrices: data.allow_edit_competitor_prices,
          allowEditPrices: data.allow_edit_prices,
          allowEditShippingValue: data.allow_edit_shipping_value,
          allowSendToErp: data.allow_send_to_erp,
          allowEditShippingType: data.allow_edit_shipping_type,
          allowEditProductMargin: data.allow_edit_product_margin,
        };

        return mappedData;
      }),
    );
  }
}
