
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ConsumerRoutingModule } from './consumer-routing.module';
import { ConsumerServices } from './services/consumer-services.service';
import { ConsumerDataStorageService } from './services/consumer-datastorage.service';
import { WaitlistDetailResolver } from './services/waitlist-detail-resolver.service';
import { SharedServices } from '../shared/services/shared-services';
import { ConsumerComponent } from './consumer.component';
import { projectConstants } from '../app.component';
import { ProviderSharedFuctions } from '../ynw_provider/shared/functions/provider-shared-functions';
import { MatBadgeModule } from '@angular/material/badge';
import { UpdateProfilePopupModule } from '../shared/components/update-profile-popup/update-profile-popup.module';
@NgModule({
  imports: [
    ConsumerRoutingModule,
    UpdateProfilePopupModule
  ],
  declarations: [
    ConsumerComponent
  ],
  exports: [MatBadgeModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    SharedServices,
    ConsumerServices,
    ConsumerDataStorageService,
    ProviderSharedFuctions,
    WaitlistDetailResolver,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS }
  ]
})
export class ConsumerModule { }
