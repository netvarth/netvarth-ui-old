import { NgModule } from '@angular/core';
import { ConsumerPaymentsComponent } from './payments.component';
import { ConsumerPaymentsRoutingModule } from './payments.routing.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { ConsumerPaymentDetailsComponent } from './payment-details/payment-details.component';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { QuestionnaireModule } from '../../../shared/components/questionnaire/questionnaire.module';
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH+'./assets/i18n/home/', '.json');
}@NgModule({
    declarations: [
        ConsumerPaymentsComponent,
        ConsumerPaymentDetailsComponent
    ],
    imports: [
        ConsumerPaymentsRoutingModule,
        BreadCrumbModule,
        CommonModule,
        SharedModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule,
        HeaderModule,
        QuestionnaireModule,
        HttpClientModule,
        TranslateModule.forChild({
          loader: {
              provide: TranslateLoader,
              useFactory: homeHttpLoaderFactory,
              deps: [HttpClient]
          },
      })
    ],
    exports: [
        ConsumerPaymentsComponent
    ]
})
export class ConsumerPaymentsModule { }
