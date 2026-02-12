import { Injectable } from '@angular/core';
import { IUpdateCredentials } from 'src/app/core/models/auth.model';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { IUserView } from 'src/app/core/models/user.model';
import { UserRepository } from 'src/app/core/repositories/user.repository';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private repository: UserRepository) {}

  loadUsers(paginator: IDefaultPaginatorDataSource<IUserView>, search?: string) {
    return this.repository.getUsers(paginator, search);
  }

  getUserInfoByUserId(userid: string) {
    return this.repository.getUserInfoByUserId(userid);
  }

  updateUserName(userName: string, userId: string) {
    return this.repository.updateUserName(userName, userId);
  }

  updateUserCredentials(data: IUpdateCredentials) {
    return this.repository.updateUserCredentials(data);
  }
}
