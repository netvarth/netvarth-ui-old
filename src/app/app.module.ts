import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, ErrorHandler, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { RatingStarModule } from './shared/modules/ratingstar/ratingstart.module';
import { PagerModule } from './shared/modules/pager/pager.module';
// import { HeaderModule } from './shared/modules/header/header.module';
// import { CheckInModule } from './shared/modules/check-in/check-in.module';
import { ConsumerCheckinHistoryListModule } from './shared/modules/consumer-checkin-history-list/consumer-checkin-history-list.module';
import { AppComponent, projectConstants } from './app.component';
import { HomeComponent } from './shared/components/home/home.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { SignUpComponent } from './shared/components/signup/signup.component';
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
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EqualValidator } from './shared/directives/equal-validator.directive';
import { FormMessageDisplayModule } from './shared/modules/form-message-display/form-message-display.module';
import { FormMessageDisplayService } from './shared/modules/form-message-display/form-message-display.service';
import { ProviderDetailService } from './shared/components/provider-detail/provider-detail.service';
import { CapitalizeFirstPipeModule } from './shared/pipes/capitalize.module';
import { OwlModule } from 'ngx-owl-carousel';
import { LocationStrategy, PathLocationStrategy } from '../../node_modules/@angular/common';
import { CouponsComponent } from './shared/components/coupons/coupons.component';
import { RequestForComponent } from './ynw_provider/components/request-for/request-for.component';
import { BusinessPageComponent } from './shared/components/business-page/business-page.component';
import { ProviderAppModule } from './ynw_provider/provider-app.module';
import { MaintenanceModule } from './shared/modules/maintenance/maintenance.module';
import { LoadingSpinnerModule } from './shared/modules/loading-spinner/loading-spinner.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LazyModule } from './shared/modules/lazy-load/lazy.module';
import { ForceDialogComponent } from './shared/components/force-dialog/force-dialog.component';
import { AdminLoginComponent } from './shared/components/admin/login/login.component';
import { ConsumerJoinComponent } from './ynw_consumer/components/consumer-join/join.component';
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
import { Razorpaymodel } from './shared/components/razorpay/razorpay.model';
import { RazorpayprefillModel } from './shared/components/razorpay/razorpayprefill.model';
import { WindowRefService } from './shared/services/windowRef.service';
import { RazorpayService } from './shared/services/razorpay.service';
import { PaymentLinkComponent } from './shared/components/payment-link/payment-link.component';
import { ProviderDataStorageService } from './ynw_provider/services/provider-datastorage.service';
import { JoyrideModule } from 'ngx-joyride';
import { UpdateProfilePopupComponent } from './shared/components/update-profile-popup/update-profile-popup.component';
import { ShareService } from 'ngx-sharebuttons';
import { ConsumerFooterModule } from './ynw_consumer/components/footer/footer.module';
import { HeaderModule } from './shared/modules/header/header.module';
import { VoicecallDetailsSendComponent } from './business/modules/appointments/voicecall-details-send/voicecall-details-send.component';
import { TruncateModule } from './shared/pipes/limitTo.module';
import { GlobalErrorHandler } from './shared/modules/error-handler/error-handler.component';
import { CardModule } from './shared/components/card/card.module';
import { CheckoutSharedComponent } from './shared/components/checkout/checkout.component';
import { MatStepperModule } from '@angular/material/stepper';
import { AddAddressComponent } from './shared/components/checkout/add-address/add-address.component';
import {  ItemDetailsSharedComponent } from './shared/components/item-details/item-details.component';
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
import { MeetingRoomComponent } from './business/shared/meeting-room/meeting-room.component';
import { MeetService } from './shared/services/meet-service';
import { CommunicationComponent } from './shared/components/communication/communication.component';
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
import { ListRecordingsDialogComponent } from './shared/components/list-recordings-dialog/list-recordings-dialog.component';
import { VirtualFieldsModule } from './ynw_consumer/components/virtualfields/virtualfields.module';
import { BusinessPageHomeComponent } from './shared/components/business-page-home/business-page-home.component';
import { MeetRoomComponent } from './ynw_consumer/components/meet-room/meet-room.component';
import { MeetRoomModule } from './ynw_consumer/components/meet-room/meet-room.module';
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
    ManageProviderComponent,
    CheckYourStatusComponent,
    PaymentLinkComponent,
    VoicecallDetailsSendComponent,
    JdnComponent,
    UpdateProfilePopupComponent,
    CheckoutSharedComponent,
    AddAddressComponent,
    ItemDetailsSharedComponent,
    MeetingRoomComponent,
    CommunicationComponent,
    ListRecordingsDialogComponent,
    BusinessPageHomeComponent
  ],
  entryComponents: [
    SignUpComponent,
    LoginComponent,
    ConfirmBoxComponent,
    AddInboxMessagesComponent,
    ExistingCheckinComponent,
    ServiceDetailComponent,
    ConsumerRateServicePopupComponent,
    VoicecallDetailsSendComponent,
    CouponsComponent,
    RequestForComponent,
    ForceDialogComponent,
    JdnComponent,
    UpdateProfilePopupComponent,
    AddAddressComponent,
    ListRecordingsDialogComponent,
    MeetRoomComponent
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
    // CheckInModule,
    ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    ConsumerCheckinHistoryListModule,
    Nl2BrPipeModule,
    MaintenanceModule,
    ScrollbarModule,
    OwlModule,
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
    CardModule,
    MatStepperModule,
    NgxIntlTelInputModule,
    ModalModule.forRoot(),
    ShareIconsModule,
    VirtualFieldsModule,
    MeetRoomModule,
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
    RazorpayService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExtendHttpInterceptor,
      multi: true
    },
    AuthService,
    ConsumerAuthService,
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
    Title,
    CommonDataStorageService,
    {provide: ErrorHandler, useClass: GlobalErrorHandler, deps: [SharedServices]},
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


