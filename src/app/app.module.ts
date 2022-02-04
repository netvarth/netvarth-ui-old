import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, ErrorHandler, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceMeta } from './shared/services/service-meta';
import { ExtendHttpInterceptor } from './shared/config/extendhttp.interceptor';
import {  MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppComponent, projectConstants } from './app.component';
import { SearchDetailServices } from './shared/components/search-detail/search-detail-services.service';
import { AuthGuardConsumer, AuthGuardProvider, AuthGuardHome, AuthGuardLogin} from './shared/guard/auth.guard';
import { SharedServices } from './shared/services/shared-services';
import { SharedFunctions } from './shared/functions/shared-functions';
import {  MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EqualValidator } from './shared/directives/equal-validator.directive';
import { FormMessageDisplayService } from './shared/modules/form-message-display/form-message-display.service';
import { ProviderDetailService } from './shared/components/provider-detail/provider-detail.service';
import {  DatePipe, LocationStrategy, PathLocationStrategy } from '../../node_modules/@angular/common';
import { GlobalService } from './shared/services/global-service';
import { Razorpaymodel } from './shared/components/razorpay/razorpay.model';
import { RazorpayprefillModel } from './shared/components/razorpay/razorpayprefill.model';
import { WindowRefService } from './shared/services/windowRef.service';
import { RazorpayService } from './shared/services/razorpay.service';
import { ProviderDataStorageService } from './business/services/provider-datastorage.service';
import { ShareService } from 'ngx-sharebuttons';
import { GlobalErrorHandler } from './shared/modules/error-handler/error-handler.component';
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
import { BsModalService } from 'ngx-bootstrap/modal';
import { JaldeeTimeService } from './shared/services/jaldee-time-service';
import { FileService } from './shared/services/file-service';
import { LivetrackService } from './shared/services/livetrack-service';
import { TeleBookingService } from './shared/services/tele-bookings-service';
import { BookingService } from './shared/services/booking-service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ConsumerAuthService } from './shared/services/consumer-auth-service';
import { MediaService } from './shared/services/media-service';
import { FileReaderService } from './shared/services/file-reader.service';
import { PaytmService } from './shared/services/paytm.service';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ProviderServices } from './business/services/provider-services.service';
import { DateFormatPipeModule } from './shared/pipes/date-format/date-format.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ForceDialogModule } from './shared/components/force-dialog/force-dialog.module';
import { ChunkErrorHandler } from './shared/modules/error-handler/chunk-error-handler';
export function init_app(globalService: GlobalService) {
  return () => globalService.load();
}
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  if (projectConstants) {
    return new TranslateHttpLoader(http, projectConstants.PATH + 'assets/i18n/home/', '.json');
  }
}

@NgModule({
  declarations: [
    AppComponent,
    EqualValidator
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    RouterModule,
    AppRoutingModule,
    DateFormatPipeModule,
    MatSnackBarModule,
    ForceDialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      // isolate: true,
    }),
    ScrollToModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    ChunkErrorHandler,
    ProviderServices,
    DatePipe,
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
