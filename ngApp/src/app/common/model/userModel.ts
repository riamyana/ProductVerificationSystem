import { Users } from './user';
export interface UserModel {
  publicAddress?: String,
  userName?: String,
  userRole?: Users,
  email?: String,
  companyOrFullName?: String,
  nonce?: String,
  token?: String
}
