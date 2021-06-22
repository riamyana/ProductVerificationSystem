import { UsersEnum } from './userEnum';
export interface UserModel {
  publicAddress?: String,
  userName?: String,
  userRole?: UsersEnum,
  email?: String,
  companyOrFullName?: String,
  nonce?: String,
  token?: String
}
