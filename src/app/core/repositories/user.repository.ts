import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { finalize, from, map, Observable, switchMap } from 'rxjs';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { IDefaultPaginatorDataSource } from '../models/query.model';
import { LoadingService } from '../services/loading.service';
import { IUserView } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserRepository {
  private supabase: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
  ) {
    this.supabase = this.supabaseService.supabase;
  }

  getUsers(
    paginator: IDefaultPaginatorDataSource<IUserView>,
    search?: string,
  ): Observable<{ data: IUserView[]; count: number }> {
    const fromIdx = paginator.pageIndex * paginator.pageSize;
    const toIdx = fromIdx + paginator.pageSize - 1;

    let query = this.supabase
      .from('users')
      .select(
        `
        id,
        name, 
        email,
        created_at,
        updated_at
        `,
        { count: 'exact' },
      )
      .order('name', { ascending: true });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    this.loadingService.show();
    return from(query.range(fromIdx, toIdx)).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const mappedData: IUserView[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          lastSignIn: item.last_sign_in_at,
        }));

        return { data: mappedData, count: count ?? 0 };
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  getUserInfoByUserId(userId: string) {
    return from(
      this.supabase
        .from('users')
        .select(
          `
      id,
      name,
      email
      `,
        )
        .eq('id', userId)
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error();

        return data;
      }),
    );
  }

  updateUserName(newUserName: string, userId: string) {
    return from(
      this.supabase
        .from('users')
        .update({
          name: newUserName,
        })
        .eq('id', userId)
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        return data;
      }),
    );
  }
}
