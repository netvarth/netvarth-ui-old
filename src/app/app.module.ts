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
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { SearchModule } from './shared/modules/search/search.module';
import { RatingStarModule } from './shared/modules/ratingstar/ratingstart.module';
import { PagerModule } from './shared/modules/pager/pager.module';
import { HeaderModule } from './shared/modules/header/header.module';
import { CheckInModule } from './shared/modules/check-in/check-in.module';
import { ConsumerCheckinHistoryListModule } from './shared/modules/consumer-checkin-history-list/consumer-checkin-history-list.module';
import { AppComponent } from './app.component';
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
import { MatDialogModule } from '@angular/material';
import { EqualValidator } from './shared/directives/equal-validator.directive';
import { FormMessageDisplayModule } from './shared/modules/form-message-display/form-message-display.module';
import { FormMessageDisplayService } from './shared/modules/form-message-display/form-message-display.service';
import { ProviderDetailService } from './shared/components/provider-detail/provider-detail.service';
import { CapitalizeFirstPipeModule } from './shared/pipes/capitalize.module';
import { projectConstants } from './shared/constants/project-constants';
import { OwlModule } from 'ngx-owl-carousel';
import 'hammerjs';
import { LocationStrategy, HashLocationStrategy } from '../../node_modules/@angular/common';
import { CouponsComponent } from './shared/components/coupons/coupons.component';
import { RequestForComponent } from './ynw_provider/components/request-for/request-for.component';
import { BusinessPageComponent } from './shared/components/business-page/business-page.component';
import { ProviderAppModule } from './ynw_provider/provider-app.module';
import { PhomeComponent } from './shared/components/phome/phome.component';
import { AboutJaldeeModule } from './shared/modules/about-jaldee/about-jaldee.module';
import { MaintenanceModule } from './shared/modules/maintenance/maintenance.module';
import { LoadingSpinnerModule } from './ynw_provider/components/loading-spinner/loading-spinner.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LazyModule } from './shared/modules/lazy-load/lazy.module';
import { ForceDialogComponent } from './shared/components/force-dialog/force-dialog.component';
import { SearchProviderComponent } from './shared/components/search-provider/search-provider.component';
import { SearchProviderModule } from './shared/components/search-provider/search-provider.module';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LogoutComponent,
    ForgotPasswordComponent,
    EqualValidator,
    SignUpComponent,
    SetPasswordFormComponent,
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
    ForceDialogComponent
    // PhomeComponent,
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
    ScrollToModule.forRoot()
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
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
