import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/modules/common/shared.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { ScrollbarModule } from 'ngx-scrollbar';
import { AppRoutingModule } from './app-routing.module';
import { ServiceMeta } from './shared/services/service-meta';
import { ExtendHttpInterceptor } from './shared/config/extendhttp.interceptor';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { SearchModule } from './shared/modules/search/search.module';
import { RatingStarModule } from './shared/modules/ratingstar/ratingstart.module';
import { PagerModule } from './shared/modules/pager/pager.module';
import { HeaderModule } from './shared/modules/header/header.module';
import { CheckInModule } from './shared/modules/check-in/check-in.module';
import { ConsumerCheckinHistoryListModule } from './shared/modules/consumer-checkin-history-list/consumer-checkin-history-list.module';
import { AppComponent, projectConstants } from './app.component';
import { HomeComponent } from './shared/components/home/home.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { ForgotPasswordComponent } from './shared/components/forgot-password/forgot-password.component';
import { SignUpComponent } from './shared/components/signup/signup.component';
import { SetPasswordFormComponent } from './shared/components/set-password-form/set-password-form.component';
import { LoginComponent } from './shared/components/login/login.component';
import { SearchDetailServices } from './shared/components/search-detail/search-detail-services.service';
import { ConfirmBoxComponent } from './shared/components/confirm-box/confirm-box.component';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { AddInboxMessagesComponent } from './shared/components/add-inbox-messages/add-inbox-messages.component';
import { ExistingCheckinComponent } from './shared/components/existing-checkin/existing-checkin.component';
import { ServiceDetailComponent } from './shared/components/service-detail/service-detail.component';
import { ConsumerRateServicePopupComponent } from './shared/components/consumer-rate-service-popup/consumer-rate-service-popup';
import { AuthGuardConsumer, AuthGuardProvider, AuthGuardHome, AuthGuardLogin} from './shared/guard/auth.guard';
import { SharedServices } from './shared/services/shared-services';
import { SharedFunctions } from './shared/functions/shared-functions';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EqualValidator } from './shared/directives/equal-validator.directive';
import { FormMessageDisplayModule } from './shared/modules/form-message-display/form-message-display.module';
import { FormMessageDisplayService } from './shared/modules/form-message-display/form-message-display.service';
import { ProviderDetailService } from './shared/components/provider-detail/provider-detail.service';
import { CapitalizeFirstPipeModule } from './shared/pipes/capitalize.module';
import { OwlModule } from 'ngx-owl-carousel';
import 'hammerjs';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '../../node_modules/@angular/common';
import { CouponsComponent } from './shared/components/coupons/coupons.component';
import { RequestForComponent } from './ynw_provider/components/request-for/request-for.component';
import { BusinessPageComponent } from './shared/components/business-page/business-page.component';
import { ProviderAppModule } from './ynw_provider/provider-app.module';
import { AboutJaldeeModule } from './shared/modules/about-jaldee/about-jaldee.module';
import { MaintenanceModule } from './shared/modules/maintenance/maintenance.module';
import { LoadingSpinnerModule } from './ynw_provider/components/loading-spinner/loading-spinner.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LazyModule } from './shared/modules/lazy-load/lazy.module';
import { ForceDialogComponent } from './shared/components/force-dialog/force-dialog.component';
import { SearchProviderModule } from './shared/components/search-provider/search-provider.module';
import { AdminLoginComponent } from './shared/components/admin/login/login.component';
import { ConsumerJoinComponent } from './ynw_consumer/components/consumer-join/join.component';
import { ConsumerPaymentmodeComponent } from './shared/components/consumer-paymentmode/consumer-paymentmode.component';
import { DateFormatPipeModule } from './shared/pipes/date-format/date-format.module';
import { DisplayboardLayoutContentModule } from './business/modules/displayboard-content/displayboard-content.module';
import { ManageProviderComponent } from './shared/components/manage-provider/manage-provider.component';
import { SalesChannelModule } from './shared/modules/saleschannel/saleschannel.module';
import { ForgotPasswordModule } from './shared/components/forgot-password/forgot-password.module';
import { SetPasswwordModule } from './shared/components/set-password-form/set-password-form.module';
import { JdnComponent } from './shared/components/jdn-detail/jdn-detail-component';
import { CheckYourStatusComponent } from './shared/components/status-check/check-status.component';
import { BreadCrumbModule } from './shared/modules/breadcrumb/breadcrumb.module';
import { GlobalService } from './shared/services/global-service';
import { GlobalFunctions } from './shared/functions/global-functions';
import { GlobalErrorHandler } from './shared/modules/error-handler/error-handler.component';
import { Razorpaymodel } from './shared/components/razorpay/razorpay.model';
import { RazorpayprefillModel } from './shared/components/razorpay/razorpayprefill.model';
import { WindowRefService } from './shared/services/windowRef.service';
import { RazorpayService } from './shared/services/razorpay.service';
import { PaymentLinkComponent } from './shared/components/payment-link/payment-link.component';
import { ProviderDataStorageService } from './ynw_provider/services/provider-datastorage.service';

export function init_app(globalService: GlobalService) {
  return () => globalService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LogoutComponent,
    EqualValidator,
    SignUpComponent,
    LoginComponent,
    ConfirmBoxComponent,
    ReturnPaymentComponent,
    AddInboxMessagesComponent,
    ExistingCheckinComponent,
    ServiceDetailComponent,
    ConsumerRateServicePopupComponent,
    CouponsComponent,
    RequestForComponent,
    BusinessPageComponent,
    ForceDialogComponent,
    AdminLoginComponent,
    ConsumerJoinComponent,
    ConsumerPaymentmodeComponent,
    ManageProviderComponent,
    CheckYourStatusComponent,
    PaymentLinkComponent,
    JdnComponent,
    // PhomeComponent,
  ],
  entryComponents: [
    SignUpComponent,
    LoginComponent,
    ConfirmBoxComponent,
    AddInboxMessagesComponent,
    ExistingCheckinComponent,
    ServiceDetailComponent,
    ConsumerRateServicePopupComponent,
    CouponsComponent,
    RequestForComponent,
    ConsumerPaymentmodeComponent,
    ForceDialogComponent,
    JdnComponent
  ],
  imports: [
    CapitalizeFirstPipeModule,
    BreadCrumbModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule,
    FormMessageDisplayModule,
    AngularMultiSelectModule,
    SearchModule,
    PagerModule,
    SharedModule,
    RatingStarModule,
    HeaderModule,
    CheckInModule,
    ModalGalleryModule.forRoot(),
    ConsumerCheckinHistoryListModule,
    Nl2BrPipeModule,
    AboutJaldeeModule,
    MaintenanceModule,
    ScrollbarModule,
    OwlModule,
    ProviderAppModule,
    LoadingSpinnerModule,
    LazyModule,
    SearchProviderModule,
    ScrollToModule.forRoot(),
    DateFormatPipeModule,
    DisplayboardLayoutContentModule,
    SalesChannelModule,
    ForgotPasswordModule,
    SetPasswwordModule

  ],
  providers: [
    AuthGuardConsumer,
    AuthGuardProvider,
    AuthGuardHome,
    AuthGuardLogin,
    ServiceMeta,
    Razorpaymodel,
    RazorpayprefillModel,
    WindowRefService,
    RazorpayService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExtendHttpInterceptor,
      multi: true
    },
    SharedServices,
    GlobalFunctions,
    GlobalService,
    SharedFunctions,
    FormMessageDisplayService,
    SearchDetailServices,
    ProviderDetailService,
    ProviderDataStorageService,
    Title,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [GlobalService], multi: true },
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

