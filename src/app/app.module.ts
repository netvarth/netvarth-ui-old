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
// import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { RatingStarModule } from './shared/modules/ratingstar/ratingstart.module';
import { PagerModule } from './shared/modules/pager/pager.module';
// import { HeaderModule } from './shared/modules/header/header.module';
// import { CheckInModule } from './shared/modules/check-in/check-in.module';
import { ConsumerCheckinHistoryListModule } from './shared/modules/consumer-checkin-history-list/consumer-checkin-history-list.module';
import { AppComponent, projectConstants } from './app.component';
import { HomeComponent } from './shared/components/home/home.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { ConfirmBoxComponent } from './shared/components/confirm-box/confirm-box.component';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { AddInboxMessagesComponent } from './shared/components/add-inbox-messages/add-inbox-messages.component';
import { ServiceDetailComponent } from './shared/components/service-detail/service-detail.component';
import { ConsumerRateServicePopupComponent } from './shared/components/consumer-rate-service-popup/consumer-rate-service-popup';
import { AuthGuardConsumer, AuthGuardHome, AuthGuardLogin} from './shared/guard/auth.guard';
import { SharedServices } from './shared/services/shared-services';
import { SharedFunctions } from './shared/functions/shared-functions';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EqualValidator } from './shared/directives/equal-validator.directive';
import { FormMessageDisplayModule } from './shared/modules/form-message-display/form-message-display.module';
import { FormMessageDisplayService } from './shared/modules/form-message-display/form-message-display.service';
import { CapitalizeFirstPipeModule } from './shared/pipes/capitalize.module';
import { OwlModule } from 'ngx-owl-carousel';
import { HashLocationStrategy, LocationStrategy } from '../../node_modules/@angular/common';
import { CouponsComponent } from './shared/components/coupons/coupons.component';
import { BusinessPageComponent } from './shared/components/business-page/business-page.component';
import { MaintenanceModule } from './shared/modules/maintenance/maintenance.module';
import { LoadingSpinnerModule } from './shared/modules/loading-spinner/loading-spinner.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LazyModule } from './shared/modules/lazy-load/lazy.module';
import { ForceDialogComponent } from './shared/components/force-dialog/force-dialog.component';
import { ConsumerJoinComponent } from './ynw_consumer/components/consumer-join/join.component';
import { DateFormatPipeModule } from './shared/pipes/date-format/date-format.module';
import { ForgotPasswordModule } from './shared/components/forgot-password/forgot-password.module';
import { SetPasswwordModule } from './shared/components/set-password-form/set-password-form.module';
import { JdnComponent } from './shared/components/jdn-detail/jdn-detail-component';
import { GlobalService } from './shared/services/global-service';
import { Razorpaymodel } from './shared/components/razorpay/razorpay.model';
import { RazorpayprefillModel } from './shared/components/razorpay/razorpayprefill.model';
import { WindowRefService } from './shared/services/windowRef.service';
import { RazorpayService } from './shared/services/razorpay.service';
import { UpdateProfilePopupComponent } from './shared/components/update-profile-popup/update-profile-popup.component';
// import { ShareService } from 'ngx-sharebuttons';
import { ConsumerFooterModule } from './ynw_consumer/components/footer/footer.module';
import { HeaderModule } from './shared/modules/header/header.module';
import { TruncateModule } from './shared/pipes/limitTo.module';
import { GlobalErrorHandler } from './shared/modules/error-handler/error-handler.component';
import { CardModule } from './shared/components/card/card.module';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SessionStorageService } from './shared/services/session-storage.service';
import { CookieProcessor } from './shared/services/cookie-processor.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { GroupStorageService } from './shared/services/group-storage.service';
import { WordProcessor } from './shared/services/word-processor.service';
import { SnackbarService } from './shared/services/snackbar.service';
import { ErrorMessagingService } from './shared/services/error-message.service';
import { CommonDataStorageService } from './shared/services/common-datastorage.service';
import { MeetService } from './shared/services/meet-service';
import { CommunicationComponent } from './shared/components/communication/communication.component';
import { DateTimeProcessor } from './shared/services/datetime-processor.service';
import { DomainConfigGenerator } from './shared/services/domain-config-generator.service';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
// import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { JaldeeTimeService } from './shared/services/jaldee-time-service';
import { FileService } from './shared/services/file-service';
import { LivetrackService } from './shared/services/livetrack-service';
import { TeleBookingService } from './shared/services/tele-bookings-service';
import { BookingService } from './shared/services/booking-service';
import { ProviderServices } from './ynw_provider/services/provider-services.service';
import { DepartmentServicePageComponent } from './shared/components/department-service-page/department-service-page.component';
import { ProviderDetailService } from './shared/services/provider-detail.service';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { VirtualFieldsModule } from './ynw_consumer/components/virtualfields/virtualfields.module';
import { SearchDetailServices } from './shared/components/search-detail/search-detail-services.service';
import { QRCodeGeneratordetailComponent } from './shared/components/qrcodegenerator/qrcodegeneratordetail.component';
import { NotificationDialogComponent } from './shared/components/notification-dialog/notification-dialog.component';
// import { IonicModule } from '@ionic/angular';
// import { Device } from '@ionic-native/device/ngx';
import { AttachmentPopupComponent } from './shared/components/attachment-popup/attachment-popup.component';
import { ShowuploadfileComponent } from './shared/components/showuploadfile/showuploadfile.component';
import { PaytmService } from './shared/services/paytm.service';
// import { FirebaseX } from '@ionic-native/firebase-x/ngx';
export function init_app(globalService: GlobalService) {
  return () => globalService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LogoutComponent,
    EqualValidator,
    ConfirmBoxComponent,
    ReturnPaymentComponent,
    AddInboxMessagesComponent,
    ServiceDetailComponent,
    ConsumerRateServicePopupComponent,
    CouponsComponent,
    BusinessPageComponent,
    ForceDialogComponent,
    ConsumerJoinComponent,
    JdnComponent,
    UpdateProfilePopupComponent,
    CommunicationComponent,
    DepartmentServicePageComponent,
    QRCodeGeneratordetailComponent,
    NotificationDialogComponent,
    AttachmentPopupComponent,
    ShowuploadfileComponent
  ],
  entryComponents: [
    ConfirmBoxComponent,
    AddInboxMessagesComponent,
    ServiceDetailComponent,
    ConsumerRateServicePopupComponent,
    CouponsComponent,
    ForceDialogComponent,
    JdnComponent,
    UpdateProfilePopupComponent,
    NotificationDialogComponent,
    AttachmentPopupComponent,
    ShowuploadfileComponent
  ],
  imports: [
    CapitalizeFirstPipeModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule,
    FormMessageDisplayModule,
    // AngularMultiSelectModule,
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
    LoadingSpinnerModule,
    LazyModule,
    ScrollToModule.forRoot(),
    DateFormatPipeModule,
    ForgotPasswordModule,
    SetPasswwordModule,
    ConsumerFooterModule,
    TruncateModule,
    CardModule,
    MatStepperModule,
    NgxIntlTelInputModule,
    MatSelectModule,
    ModalModule.forRoot(),
    // ShareIconsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    VirtualFieldsModule,
    // IonicModule.forRoot()
  ],
  providers: [
    BsModalService,
    // Device,
    // FirebaseX,
    AuthGuardConsumer,
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
    SharedServices,
    GlobalService,
    ProviderServices,
    SharedFunctions,
    FormMessageDisplayService,
    ErrorMessagingService,
    ProviderDetailService,
    // ShareService,
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
    MatDatepickerModule,  
    MatNativeDateModule,
    Title,
    CommonDataStorageService,
    SearchDetailServices,
    {provide: ErrorHandler, useClass: GlobalErrorHandler, deps: [SharedServices]},
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [GlobalService], multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
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


