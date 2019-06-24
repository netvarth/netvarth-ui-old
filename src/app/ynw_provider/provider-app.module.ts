import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HomeAppComponent } from '../shared/components/home-app/home-app.component';
import { OtpFormAppComponent } from '../shared/modules/otp-form-app/otp-form-app.component';
import { SetPasswordAppComponent } from '../shared/components/set-password-app/set-password-app.component';
import { ForgotPasswordAppComponent } from '../shared/components/forgot-password-app/forgot-password-app.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../shared/modules/form-message-display/form-message-display.module';
import { FooterModule } from '../shared/modules/footer/footer.module';
import { SharedServices } from '../shared/services/shared-services';
import { SharedFunctions } from '../shared/functions/shared-functions';
import { LoadingSpinnerModule } from './components/loading-spinner/loading-spinner.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    FormMessageDisplayModule,
    FooterModule,
    FormsModule,
    LoadingSpinnerModule
],
  declarations: [
    HomeAppComponent,
    OtpFormAppComponent,
    SetPasswordAppComponent,
    ForgotPasswordAppComponent
  ],
  exports: [],
  entryComponents: [
    HomeAppComponent,
    OtpFormAppComponent,
    SetPasswordAppComponent,
    ForgotPasswordAppComponent
  ],
  providers : [
    SharedServices,
    SharedFunctions
  ]
})

export class ProviderAppModule {

}


