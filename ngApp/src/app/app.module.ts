import { JwtInterceptorService } from './interceptors/jwt-interceptor.service';
import { AuthGuardGuard } from './auth-guard.guard';
import { EthcontractService } from './service/ethcontract.service';
import { NotifierComponent } from './shared/notifier/notifier.component';
import { MaterialModule } from './material/material.module';
import { DefaultModule } from './layouts/default/default.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    NotifierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DefaultModule,
    MaterialModule,
    QRCodeModule,
    HttpClientModule
  ],
  providers: [EthcontractService, AuthGuardGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
