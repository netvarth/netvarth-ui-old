import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';

import { AddMemberComponent } from './add-member.component';
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from '../../constants/project-constants';
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,projectConstantsLocal.PATH+ './assets/i18n/home/', '.json');
}


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        FormsModule,
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
        AddMemberComponent
    ],
    declarations: [
        AddMemberComponent
    ],
    exports: [AddMemberComponent]
})
export class AddMemberModule {
}
