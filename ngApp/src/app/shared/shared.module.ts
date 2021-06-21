import { RouterModule } from '@angular/router';
import { MaterialModule } from './../material/material.module';
import { NavComponent } from './nav/nav.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule} from '@angular/flex-layout';



@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule
  ],
  exports: [
    NavComponent
  ]
})
export class SharedModule { }
