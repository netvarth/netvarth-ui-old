import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/modules/common/shared.module';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { KioskRouterModule } from './kiosk-routing.module';

import { PagerModule } from '../shared/modules/pager/pager.module';
import { CheckInModule } from '../shared/modules/check-in/check-in.module';

import { KioskComponent } from './kiosk.component';
import { KioskHomeComponent } from './components/home/kiosk-home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LookupStatusComponent } from './components/lookup-status/lookup-status.component';
import { RateVisitComponent } from './components/rate-visit/rate-visit.component';

import { SharedServices } from '../shared/services/shared-services';
import { SharedFunctions } from '../shared/functions/shared-functions';
import { KioskServices } from './services/kiosk-services.service';
import { projectConstants } from '../shared/constants/project-constants';

import 'hammerjs';
import 'mousetrap';

@NgModule({
    imports: [
        KioskRouterModule,
        SharedModule,
        AngularMultiSelectModule,
        PagerModule,
        CheckInModule
    ],
    declarations: [
        KioskComponent,
        KioskHomeComponent,
        HeaderComponent,
        FooterComponent,
        LookupStatusComponent,
        RateVisitComponent
    ],
    /*exports: [ConfirmBoxComponent],
      entryComponents: [
        ConfirmBoxComponent,
    ],*/
    providers: [
       SharedServices,
       SharedFunctions,
       KioskServices,
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS }
    ]

})

export class KioskModule {

}
