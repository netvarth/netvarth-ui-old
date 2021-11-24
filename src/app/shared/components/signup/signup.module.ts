import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { RouterModule } from "@angular/router";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { OtpFormModule } from "../../modules/otp-form/otp-form.module";
import { SetPasswwordModule } from "../set-password-form/set-password-form.module";
import { SignUpComponent } from "./signup.component";
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from '../../constants/project-constants';
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH+'./assets/i18n/home/', '.json');
}
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        NgxIntlTelInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        OtpFormModule,
        SetPasswwordModule,
        RouterModule,
        HttpClientModule,
        TranslateModule.forChild({
          loader: {
              provide: TranslateLoader,
              useFactory: homeHttpLoaderFactory,
              deps: [HttpClient]
          },
      })
    ],
    exports: [SignUpComponent],
    declarations: [SignUpComponent]
})
export class SignupModule {}