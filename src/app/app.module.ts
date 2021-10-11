import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, ErrorHandler, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/modules/common/shared.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { ScrollbarModule } from 'ngx-scrollbar';
import { AppRoutingModule } from './app-routing.module';
import { ServiceMeta } from './shared/services/service-meta';
import { ExtendHttpInterceptor } from './shared/config/extendhttp.interceptor';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {  MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { SearchModule } from './shared/modules/search/search.module';
import { PagerModule } from './shared/modules/pager/pager.module';
import { AppComponent, projectConstants } from './app.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { SignUpComponent } from './shared/components/signup/signup.component';
import { LoginComponent } from './shared/components/login/login.component';
import { SearchDetailServices } from './shared/components/search-detail/search-detail-services.service';
import { AuthGuardConsumer, AuthGuardProvider, AuthGuardHome, AuthGuardLogin} from './shared/guard/auth.guard';
import { SharedServices } from './shared/services/shared-services';
import { SharedFunctions } from './shared/functions/shared-functions';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EqualValidator } from './shared/directives/equal-validator.directive';
import { FormMessageDisplayModule } from './shared/modules/form-message-display/form-message-display.module';
import { FormMessageDisplayService } from './shared/modules/form-message-display/form-message-display.service';
import { ProviderDetailService } from './shared/components/provider-detail/provider-detail.service';
import { CapitalizeFirstPipeModule } from './shared/pipes/capitalize.module';
import {  LocationStrategy, PathLocationStrategy } from '../../node_modules/@angular/common';
import { ProviderAppModule } from './ynw_provider/provider-app.module';
import { LoadingSpinnerModule } from './shared/modules/loading-spinner/loading-spinner.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LazyModule } from './shared/modules/lazy-load/lazy.module';
import { ForceDialogComponent } from './shared/components/force-dialog/force-dialog.component';
import { ConsumerJoinComponent } from './ynw_consumer/components/consumer-join/join.component';
import { DateFormatPipeModule } from './shared/pipes/date-format/date-format.module';
import { DisplayboardLayoutContentModule } from './business/modules/displayboard-content/displayboard-content.module';
import { SalesChannelModule } from './shared/modules/saleschannel/saleschannel.module';
import { ForgotPasswordModule } from './shared/components/forgot-password/forgot-password.module';
import { SetPasswwordModule } from './shared/components/set-password-form/set-password-form.module';
import { BreadCrumbModule } from './shared/modules/breadcrumb/breadcrumb.module';
import { GlobalService } from './shared/services/global-service';
import { Razorpaymodel } from './shared/components/razorpay/razorpay.model';
import { RazorpayprefillModel } from './shared/components/razorpay/razorpayprefill.model';
import { WindowRefService } from './shared/services/windowRef.service';
import { RazorpayService } from './shared/services/razorpay.service';
import { ProviderDataStorageService } from './ynw_provider/services/provider-datastorage.service';
import { JoyrideModule } from 'ngx-joyride';
import { ShareService } from 'ngx-sharebuttons';
import { ConsumerFooterModule } from './ynw_consumer/components/footer/footer.module';
import { HeaderModule } from './shared/modules/header/header.module';
import { TruncateModule } from './shared/pipes/limitTo.module';
import { GlobalErrorHandler } from './shared/modules/error-handler/error-handler.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SessionStorageService } from './shared/services/session-storage.service';
import { CookieProcessor } from './shared/services/cookie-processor.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { GroupStorageService } from './shared/services/group-storage.service';
import { WordProcessor } from './shared/services/word-processor.service';
import { SnackbarService } from './shared/services/snackbar.service';
import { ErrorMessagingService } from './shared/services/error-message.service';
import { AuthService } from './shared/services/auth-service';
import { CommonDataStorageService } from './shared/services/common-datastorage.service';
import { MeetService } from './shared/services/meet-service';
import { DateTimeProcessor } from './shared/services/datetime-processor.service';
import { DomainConfigGenerator } from './shared/services/domain-config-generator.service';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { JaldeeTimeService } from './shared/services/jaldee-time-service';
import { FileService } from './shared/services/file-service';
import { LivetrackService } from './shared/services/livetrack-service';
import { TeleBookingService } from './shared/services/tele-bookings-service';
import { BookingService } from './shared/services/booking-service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ConsumerAuthService } from './shared/services/consumer-auth-service';
import { VirtualFieldsModule } from './ynw_consumer/components/virtualfields/virtualfields.module';
import { MediaService } from './shared/services/media-service';
import { FileReaderService } from './shared/services/file-reader.service';
import { PaytmService } from './shared/services/paytm.service';
import { CheckinHistoryListModule } from './shared/modules/consumer-checkin-history-list/components/checkin-history-list/checkin-history-list.module';
export function init_app(globalService: GlobalService) {
  return () => globalService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
    EqualValidator,
    SignUpComponent,
    LoginComponent,
    ForceDialogComponent,
    ConsumerJoinComponent
  ],
  entryComponents: [
    SignUpComponent,
    LoginComponent,
    ForceDialogComponent
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
    HeaderModule,
    ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    CheckinHistoryListModule,
    Nl2BrPipeModule,
    ScrollbarModule,
    ProviderAppModule,
    LoadingSpinnerModule,
    LazyModule,
    ScrollToModule.forRoot(),
    DateFormatPipeModule,
    DisplayboardLayoutContentModule,
    SalesChannelModule,
    ForgotPasswordModule,
    SetPasswwordModule,
    JoyrideModule.forRoot(),
    ConsumerFooterModule,
    TruncateModule,
    MatStepperModule,
    NgxIntlTelInputModule,
    ModalModule.forRoot(),
    ShareIconsModule,
    VirtualFieldsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    BsModalService,
    AuthGuardConsumer,
    AuthGuardProvider,
    AuthGuardHome,
    AuthGuardLogin,
    ServiceMeta,
    Razorpaymodel,
    RazorpayprefillModel,
    WindowRefService,
    PaytmService,
    RazorpayService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExtendHttpInterceptor,
      multi: true
    },
    AuthService,
    ConsumerAuthService,
    FileReaderService,
    SharedServices,
    GlobalService,
    SharedFunctions,
    FormMessageDisplayService,
    ErrorMessagingService,
    SearchDetailServices,
    ProviderDetailService,
    ProviderDataStorageService,
    ShareService,
    SessionStorageService,
    LocalStorageService,
    CookieProcessor,
    GroupStorageService,
    WordProcessor,
    DateTimeProcessor,
    DomainConfigGenerator,
    SnackbarService,
    GroupStorageService,
    MeetService,
    JaldeeTimeService,
    FileService,
    LivetrackService,
    TeleBookingService,
    BookingService,
    MediaService,
    Title,
    CommonDataStorageService,
    {provide: ErrorHandler, useClass: GlobalErrorHandler, deps: [SharedServices,Injector]},
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [GlobalService], multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
