import { UsersEnum } from './userEnum';
export interface UserModel {
  publicAddress?: String,
  userName?: String,
  userRole?: UsersEnum,
  email?: String,
  companyOrFullName?: String,
  manufacturerName?: String,
  nonce?: String,
  token?: String
}
