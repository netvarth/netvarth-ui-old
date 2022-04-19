import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { ChangePasswordComponent } from './change-password.component';
import { HeaderModule } from '../header/header.module';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
    { path: '', component: ChangePasswordComponent }
];
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from '../../constants/project-constants';
import { EqualValidatorModule } from '../../directives/equal-validator/equal-validator.module';
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH+'assets/i18n/home/', '.json');
}
@NgModule({
    imports: [
        CommonModule,
        [RouterModule.forChild(routes)],
        ReactiveFormsModule,
        FormMessageDisplayModule,
        HeaderModule,
        MatButtonModule,
        HttpClientModule,
        EqualValidatorModule,
        TranslateModule.forChild({
          loader: {
              provide: TranslateLoader,
              useFactory: homeHttpLoaderFactory,
              deps: [HttpClient]
          },
      })
    ],
    declarations: [
        ChangePasswordComponent
    ],
    exports: [ChangePasswordComponent]
})
export class ChangePasswordModule {
}
