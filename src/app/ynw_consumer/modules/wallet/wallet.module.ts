import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { SpentListModule } from './jaldee-cash/spent-list/spent-list.module';
import { TermsConditionModule } from './jaldee-cash/terms-condition/term-condition.module';
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from "../../../shared/constants/project-constants";
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH+'./assets/i18n/home/', '.json');
}

@NgModule({
  declarations: [ WalletComponent],
  imports: [
    CommonModule,
    WalletRoutingModule,
    HeaderModule,
    LoadingSpinnerModule,
    SpentListModule,
    TermsConditionModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: homeHttpLoaderFactory,
          deps: [HttpClient]
      },
  })
  ],
  exports:[WalletComponent]
})
export class WalletModule { }
