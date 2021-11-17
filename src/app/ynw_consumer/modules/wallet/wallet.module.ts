import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { JaldeeCashComponent } from './jaldee-cash/jaldee-cash.component';
import { StoreCreditComponent } from './store-credit/store-credit.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { SpentListComponent } from './jaldee-cash/spent-list/spent-list.component';
import { TermsConditionComponent } from './jaldee-cash/terms-condition/terms-condition.component';

import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH+'./assets/i18n/home/', '.json');
}


@NgModule({
  declarations: [ WalletComponent, JaldeeCashComponent, StoreCreditComponent,SpentListComponent,TermsConditionComponent],
  imports: [
    CommonModule,
    WalletRoutingModule,
    HeaderModule,
    LoadingSpinnerModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: homeHttpLoaderFactory,
          deps: [HttpClient]
      },
  })
  ],
  
  entryComponents: [
    TermsConditionComponent,
    SpentListComponent
  ],
  exports:[
    JaldeeCashComponent]
})
export class WalletModule { }
