import { Injectable } from '@angular/core';
import { IUserPermission } from 'src/app/core/models/user-permission.model';
import { UserPermissionRepository } from 'src/app/core/repositories/user-permission.repository';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionService {
  constructor(private repository: UserPermissionRepository) {}

  getPermissions(userId: string) {
    return this.repository.getUserPermissions(userId);
  }

  upsertPermissions(userPermissions: IUserPermission) {
    return this.repository.upsertUserPermissions(userPermissions);
  }
}
