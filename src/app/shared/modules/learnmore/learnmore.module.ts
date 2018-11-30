import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LearnmoreComponent } from './learnmore.component';
import { LearnmoreBprofileComponent } from './learnmore-bprofile/learnmore-bprofile.component';
import { LearnmoreWaitlistManagerComponent } from './learnmore-waitlistmanager/learnmore-waitlistmanager.component';
import { LearnmoreCheckinComponent } from './learnmore-checkin/learnmore-checkin.component';
import { LearnmoreCustomerComponent } from './learnmore-customer/learnmore-customer.component';
import { LearnmoreKioskComponent } from './learnmore-kiosk/learnmore-kiosk.component';
import { LearnmoreLicenseComponent } from './learnmore-license/learnmore-license.component';
import { LearnmoreAdjustDelayComponent } from './learnmore-adjustdelay/learnmore-adjustdelay.component';
import { LearnmoreMiscellaneousComponent } from './learnmore-miscellaneous/learnmore-miscellaneous.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ScrollToModule.forRoot()
    ],
    declarations: [
        LearnmoreComponent,
        LearnmoreBprofileComponent,
        LearnmoreWaitlistManagerComponent,
        LearnmoreCheckinComponent,
        LearnmoreCustomerComponent,
        LearnmoreKioskComponent,
        LearnmoreLicenseComponent,
        LearnmoreAdjustDelayComponent,
        LearnmoreMiscellaneousComponent
    ],
    entryComponents: [
        LearnmoreComponent
    ],
    exports: [LearnmoreComponent]
})
export class LearnmoreModule {
}
