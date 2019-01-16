import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/modules/common/shared.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { ScrollbarModule } from 'ngx-scrollbar';

import { AppRoutingModule } from './app-routing.module';
import { ServiceMeta } from './shared/services/service-meta';
import { ExtendHttpInterceptor } from './shared/config/extendhttp.interceptor';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { SearchModule } from './shared/modules/search/search.module';
import { RatingStarModule } from './shared/modules/ratingstar/ratingstart.module';
import { PagerModule } from './shared/modules/pager/pager.module';
import { HeaderModule } from './shared/modules/header/header.module';
import { CheckInModule } from './shared/modules/check-in/check-in.module';
import { ConsumerCheckinHistoryListModule } from './shared/modules/consumer-checkin-history-list/consumer-checkin-history-list.module';
import { TermsStaticModule } from './shared/modules/terms-static/terms-static.module';
import { PrivacyStaticModule } from './shared/modules/privacy-static/privacy-static.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './shared/components/home/home.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { ForgotPasswordComponent} from './shared/components/forgot-password/forgot-password.component';
import { SignUpComponent } from './shared/components/signup/signup.component';
// import { OtpFormComponent } from './shared/components/otp-form/otp-form.component';
import { SetPasswordFormComponent } from './shared/components/set-password-form/set-password-form.component';
import { LoginComponent } from './shared/components/login/login.component';
import { SearchDetailComponent } from './shared/components/search-detail/search-detail.component';
import { ProviderDetailComponent } from './shared/components/provider-detail/provider-detail.component';
import { SearchDetailServices } from './shared/components/search-detail/search-detail-services.service';
// import { ChangePasswordComponent } from './shared/components/change-password/change-password.component';
// import { ChangeMobileComponent } from './shared/components/change-mobile/change-mobile.component';
// import { ChangeEmailComponent } from './shared/components/change-email/change-email.component';
import { ConfirmBoxComponent } from './shared/components/confirm-box/confirm-box.component';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { AddInboxMessagesComponent } from './shared/components/add-inbox-messages/add-inbox-messages.component';
import { ConsumerWaitlistHistoryComponent } from './shared/components/consumer-waitlist-history/consumer-waitlist-history.component';
import { ExistingCheckinComponent } from './shared/components/existing-checkin/existing-checkin.component';
import { ServiceDetailComponent } from './shared/components/service-detail/service-detail.component';
import { ConsumerRateServicePopupComponent } from './shared/components/consumer-rate-service-popup/consumer-rate-service-popup';

import { AuthGuardConsumer, AuthGuardProvider, AuthGuardHome, AuthGuardLogin } from './shared/guard/auth.guard';
import { SharedServices } from './shared/services/shared-services';
import { SharedFunctions } from './shared/functions/shared-functions';
import { MatDialogModule } from '@angular/material';
import { EqualValidator } from './shared/directives/equal-validator.directive';
import { FormMessageDisplayModule } from './shared/modules/form-message-display/form-message-display.module';
import { FormMessageDisplayService } from './shared/modules/form-message-display/form-message-display.service';
import { ProviderDetailService } from './shared/components/provider-detail/provider-detail.service';

import { CapitalizeFirstPipeModule } from './shared/pipes/capitalize.module';

// import { SearchMoreOptionsComponent } from './shared/components/search-moreoptions/search-moreoptions.component';

import { projectConstants } from './shared/constants/project-constants';

import 'hammerjs';
import { LocationStrategy, HashLocationStrategy } from '../../node_modules/@angular/common';
import { ChartsModule } from 'ng2-charts';
import { PieChartComponent } from './shared/charts/pie-chart/pie-chart.component';
import { CouponsComponent } from './shared/components/coupons/coupons.component';
import { RequestForComponent } from './ynw_provider/components/request-for/request-for.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LogoutComponent,
    ForgotPasswordComponent,
    EqualValidator,
    SignUpComponent,
    // OtpFormComponent,
    SetPasswordFormComponent,
    LoginComponent,
    SearchDetailComponent,
    ProviderDetailComponent,
    // ChangePasswordComponent,
    // ChangeMobileComponent,
   // ChangeEmailComponent,
    ConfirmBoxComponent/*,
    SearchMoreOptionsComponent*/,
    ReturnPaymentComponent,
    AddInboxMessagesComponent,
    ConsumerWaitlistHistoryComponent,
    ExistingCheckinComponent,
    ServiceDetailComponent,
    ConsumerRateServicePopupComponent,
    PieChartComponent,
    CouponsComponent,
    RequestForComponent
  ],
  entryComponents: [
    ForgotPasswordComponent,
    SignUpComponent,
    LoginComponent,
    ConfirmBoxComponent,
    AddInboxMessagesComponent,
    ExistingCheckinComponent,
    ServiceDetailComponent,
    ConsumerRateServicePopupComponent,
    CouponsComponent,
    RequestForComponent
    /*SearchMoreOptionsComponent*/
  ],
  imports: [
    CapitalizeFirstPipeModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SlimLoadingBarModule.forRoot(),
    MatDialogModule,
    FormMessageDisplayModule,
    AngularMultiSelectModule,
    SearchModule,
    PagerModule,
    SharedModule,
    RatingStarModule,
    HeaderModule,
    CheckInModule,
    ChartsModule,
    ModalGalleryModule.forRoot(),
    ConsumerCheckinHistoryListModule,
    Nl2BrPipeModule,
    TermsStaticModule,
    PrivacyStaticModule,
    ScrollbarModule
  ],
  providers: [
    AuthGuardConsumer,
    AuthGuardProvider,
    AuthGuardHome,
    AuthGuardLogin,
    ServiceMeta,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: ExtendHttpInterceptor,
    multi: true
    },
    SharedServices,
    SharedFunctions,
    FormMessageDisplayService,
    SearchDetailServices,
    ProviderDetailService,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS},
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

