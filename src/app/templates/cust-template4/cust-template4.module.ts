import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustTemplate4Component } from './cust-template4.component';
import { HeaderModule } from '../../shared/modules/header/header.module';



@NgModule({
  declarations: [
    CustTemplate4Component
  ],
  imports: [
    CommonModule,
    HeaderModule
  ],
  exports: [
    CustTemplate4Component
  ]
})
export class CustTemplate4Module { }
