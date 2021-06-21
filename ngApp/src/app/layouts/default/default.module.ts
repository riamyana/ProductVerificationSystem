import { ChangeOwnershipComponent } from './../../shared-pages/change-ownership/change-ownership.component';
import { VerifyProductComponent } from './../../shared-pages/verify-product/verify-product.component';
import { HomeComponent } from './../../manufacturer/home/home.component';
import { AddProductComponent } from './../../manufacturer/product-details/add-product/add-product.component';
import { ProductDetailsComponent } from './../../manufacturer/product-details/product-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './../../shared-pages/login/login.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './../../material/material.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DefaultComponent } from './default.component';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';



@NgModule({
  declarations: [
    DefaultComponent,
    LoginComponent,
    ProductDetailsComponent,
    AddProductComponent,
    HomeComponent,
    VerifyProductComponent,
    ChangeOwnershipComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    QRCodeModule,
    HttpClientModule,
    ZXingScannerModule
  ],
  exports: [
    DefaultComponent,
    LoginComponent,
    ProductDetailsComponent,
    AddProductComponent,
    HomeComponent
  ]
})
export class DefaultModule { }
