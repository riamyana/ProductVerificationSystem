import { ProfileComponent } from './shared-pages/profile/profile.component';
import { AboutUsComponent } from './shared-pages/about-us/about-us.component';
import { RegisterComponent } from './shared-pages/register/register.component';
import { UsersEnum } from './common/model/userEnum';
import { AuthGuardGuard } from './auth-guard.guard';
import { ChangeOwnershipComponent } from './shared-pages/change-ownership/change-ownership.component';
import { VerifyProductComponent } from './shared-pages/verify-product/verify-product.component';
import { HomeComponent } from './manufacturer/home/home.component';
import { ProductDetailsComponent } from './manufacturer/product-details/product-details.component';
import { LoginComponent } from './shared-pages/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';

const routes: Routes = [
  { path: '', component: DefaultComponent, children: [{
    path: 'manufacturer/home', component: HomeComponent, canActivate: [AuthGuardGuard], data: { role: UsersEnum.Manufacturer}
  }, {
    path: 'manufacturer/login', component: LoginComponent
  }, {
    path: 'manufacturer/add-product', component: ProductDetailsComponent, canActivate: [AuthGuardGuard], data: { role: UsersEnum.Manufacturer}
  }, {
    path: 'verify-product', component: VerifyProductComponent
  }, {
    path: 'change-ownership', component: ChangeOwnershipComponent
  }, {
    path: 'login', component: LoginComponent
  }, {
    path: 'register', component: RegisterComponent
  }, {
    path: 'aboutUs', component: AboutUsComponent
  }, {
    path: 'profile', component: ProfileComponent
  }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
