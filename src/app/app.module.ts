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
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { PagerModule } from './shared/modules/pager/pager.module';
import { AppComponent, projectConstants } from './app.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { ConfirmBoxComponent } from './shared/components/confirm-box/confirm-box.component';
import { AddInboxMessagesComponent } from './shared/components/add-inbox-messages/add-inbox-messages.component';
import { AuthGuardConsumer, AuthGuardProvider, AuthGuardHome, AuthGuardLogin} from './shared/guard/auth.guard';
import { SharedServices } from './shared/services/shared-services';
import { SharedFunctions } from './shared/functions/shared-functions';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EqualValidator } from './shared/directives/equal-validator.directive';
import { FormMessageDisplayModule } from './shared/modules/form-message-display/form-message-display.module';
import { FormMessageDisplayService } from './shared/modules/form-message-display/form-message-display.service';
import { CapitalizeFirstPipeModule } from './shared/pipes/capitalize.module';
import { OwlModule } from 'ngx-owl-carousel';
import { HashLocationStrategy, LocationStrategy } from '../../node_modules/@angular/common';
import { RequestForComponent } from './ynw_provider/components/request-for/request-for.component';
import { ProviderAppModule } from './ynw_provider/provider-app.module';
import { MaintenanceModule } from './shared/modules/maintenance/maintenance.module';
import { LoadingSpinnerModule } from './shared/modules/loading-spinner/loading-spinner.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LazyModule } from './shared/modules/lazy-load/lazy.module';
import { ForceDialogComponent } from './shared/components/force-dialog/force-dialog.component';
import { DateFormatPipeModule } from './shared/pipes/date-format/date-format.module';
import { DisplayboardLayoutContentModule } from './business/modules/displayboard-content/displayboard-content.module';
import { SalesChannelModule } from './shared/modules/saleschannel/saleschannel.module';
import { BreadCrumbModule } from './shared/modules/breadcrumb/breadcrumb.module';
import { GlobalService } from './shared/services/global-service';
import { Razorpaymodel } from './shared/components/razorpay/razorpay.model';
import { RazorpayprefillModel } from './shared/components/razorpay/razorpayprefill.model';
import { WindowRefService } from './shared/services/windowRef.service';
import { RazorpayService } from './shared/services/razorpay.service';
import { ProviderDataStorageService } from './ynw_provider/services/provider-datastorage.service';
import { JoyrideModule } from 'ngx-joyride';
import { ShareService } from 'ngx-sharebuttons';
import { VoicecallDetailsSendComponent } from './business/modules/appointments/voicecall-details-send/voicecall-details-send.component';
import { TruncateModule } from './shared/pipes/limitTo.module';
import { GlobalErrorHandler } from './shared/modules/error-handler/error-handler.component';
import { CardModule } from './shared/components/card/card.module';
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
import { JaldeeTimeService } from './shared/services/jaldee-time-service';
import { FileService } from './shared/services/file-service';
import { LivetrackService } from './shared/services/livetrack-service';
import { TeleBookingService } from './shared/services/tele-bookings-service';
import { BookingService } from './shared/services/booking-service';
import { ConsumerAuthService } from './shared/services/consumer-auth-service';
import { ListRecordingsDialogComponent } from './shared/components/list-recordings-dialog/list-recordings-dialog.component';
import { IonicModule } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Device } from '@ionic-native/device/ngx';
import { NotificationDialogComponent } from './shared/components/notification-dialog/notification-dialog.component';
import { MediaService } from './shared/services/media-service';
import { RequestDialogComponent } from './business/shared/meeting-room/request-dialog/request-dialog.component';
import { VideoCallSharedComponent } from './business/modules/video-call/video-call.component';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AttachmentPopupComponent } from './shared/components/attachment-popup/attachment-popup.component';
import { PreventDoubleClickDirective } from './shared/directives/prevent-double-click.directive';
export function init_app(globalService: GlobalService) {
  return () => globalService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
    EqualValidator,
    ConfirmBoxComponent,
    AddInboxMessagesComponent,
    RequestForComponent,
    ForceDialogComponent,
    VoicecallDetailsSendComponent,
    MeetingRoomComponent,
    CommunicationComponent,
    ListRecordingsDialogComponent,
    NotificationDialogComponent,
    RequestDialogComponent,
    VideoCallSharedComponent,
    AttachmentPopupComponent,
    PreventDoubleClickDirective
  ],
  entryComponents: [
    ConfirmBoxComponent,
    AddInboxMessagesComponent,
    VoicecallDetailsSendComponent,
    RequestForComponent,
    ForceDialogComponent,
    ListRecordingsDialogComponent,
    NotificationDialogComponent,
    RequestDialogComponent,
    AttachmentPopupComponent

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
    PagerModule,
    SharedModule,
    ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
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
    JoyrideModule.forRoot(),
    TruncateModule,
    CardModule,
    IonicModule.forRoot()
  ],
  providers: [
    FirebaseX,
    Device,
    LocalNotifications,
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
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [GlobalService], multi: true },
    {provide: ErrorHandler, useClass: GlobalErrorHandler, deps: [SharedServices]},
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

