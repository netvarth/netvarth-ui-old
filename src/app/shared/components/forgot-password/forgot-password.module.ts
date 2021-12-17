import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { OtpFormModule } from '../../modules/otp-form/otp-form.module';
import { SetPasswwordModule } from '../set-password-form/set-password-form.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { projectConstantsLocal } from "../../constants/project-constants";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
export function homeHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http,projectConstantsLocal.PATH+ 'assets/i18n/home/', '.json');
  }
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        OtpFormModule,
        SetPasswwordModule,
        NgxIntlTelInputModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
         HttpClientModule,
        NgxIntlTelInputModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: homeHttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: false,
            // extend: true
        })
    ],
    declarations: [
        ForgotPasswordComponent
    ],
    entryComponents: [
        ForgotPasswordComponent
    ],
    exports: [ForgotPasswordComponent]
})
export class ForgotPasswordModule {
}
