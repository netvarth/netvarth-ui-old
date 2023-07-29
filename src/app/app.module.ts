import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, ErrorHandler, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceMeta } from './shared/services/service-meta';
import { ExtendHttpInterceptor } from './shared/config/extendhttp.interceptor';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppComponent } from './app.component';
import { SearchDetailServices } from './shared/components/search-detail/search-detail-services.service';
import { AuthGuardConsumer, AuthGuardProvider, AuthGuardHome, AuthGuardLogin } from './shared/guard/auth.guard';
import { SharedServices } from './shared/services/shared-services';
import { SharedFunctions } from './shared/functions/shared-functions';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormMessageDisplayService } from './shared/modules/form-message-display/form-message-display.service';
import { DatePipe, LocationStrategy, PathLocationStrategy } from '../../node_modules/@angular/common';
import { GlobalService } from './shared/services/global-service';
import { ProviderDataStorageService } from './business/services/provider-datastorage.service';
import { GlobalErrorHandler } from './shared/modules/error-handler/error-handler.component';
import { SessionStorageService } from './shared/services/session-storage.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { GroupStorageService } from './shared/services/group-storage.service';
import { WordProcessor } from './shared/services/word-processor.service';
import { SnackbarService } from './shared/services/snackbar.service';
import { ErrorMessagingService } from './shared/services/error-message.service';
import { AuthService } from './shared/services/auth-service';
import { CommonDataStorageService } from './shared/services/common-datastorage.service';
import { DateTimeProcessor } from './shared/services/datetime-processor.service';
// import { BsModalService } from 'ngx-bootstrap/modal';
import { JaldeeTimeService } from './shared/services/jaldee-time-service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
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
import { projectConstantsLocal } from './shared/constants/project-constants';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH + 'assets/i18n/home/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    AppRoutingModule,
    DateFormatPipeModule,
    MatSnackBarModule,
    ForceDialogModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
    ScrollToModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    ChunkErrorHandler,
    ProviderServices,
    DatePipe,
    // TranslateService,
    // BsModalService,
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
    AuthService,
    SharedServices,
    GlobalService,
    SharedFunctions,
    FormMessageDisplayService,
    ErrorMessagingService,
    SearchDetailServices,
    ProviderDataStorageService,
    SessionStorageService,
    LocalStorageService,
    GroupStorageService,
    WordProcessor,
    DateTimeProcessor,
    SnackbarService,
    GroupStorageService,
    JaldeeTimeService,
    Title,
    CommonDataStorageService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler, deps: [SharedServices, Injector] },
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [GlobalService], multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: projectConstantsLocal.MY_DATE_FORMATS },
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
