import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { ChangeMobileComponent } from './change-mobile.component';
import { OtpFormModule } from '../../../shared/modules/otp-form/otp-form.module';
import { HeaderModule } from '../header/header.module';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
    { path: '', component: ChangeMobileComponent }
];
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstants } from '../../../app.component';
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstants.PATH+'assets/i18n/home/', '.json');
}
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        OtpFormModule,
        HeaderModule,
        MatButtonModule,
        [RouterModule.forChild(routes)],
        HttpClientModule,
        TranslateModule.forChild({
          loader: {
              provide: TranslateLoader,
              useFactory: homeHttpLoaderFactory,
              deps: [HttpClient]
          },
      })
    ],
    declarations: [
        ChangeMobileComponent
    ],
    exports: [ChangeMobileComponent]
})
export class ChangeMobileModule {
}
