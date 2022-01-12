import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustTemplate4Component } from './cust-template4.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { SafeHtmlModule } from '../../../shared/pipes/safe-html/safehtml.module';
import { RouterModule, Routes } from '@angular/router';
import { ServiceDisplayModule } from '../../service-display/service-display.module';

const routes: Routes = [
  { path: '', component: CustTemplate4Component }
];

@NgModule({
  declarations: [
    CustTemplate4Component
  ],
  imports: [
    CommonModule,
    HeaderModule,
    SafeHtmlModule,
    ServiceDisplayModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    CustTemplate4Component
  ]
})
export class CustTemplate4Module { }
