import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LearnmoreComponent } from './learnmore.component';
import { LearnmoreBprofileComponent } from './learnmore-bprofile/learnmore-bprofile.component';

import { HealthcareAdjustdelayComponent } from './learnmore-adjustdelay/healthcare-adjustdelay/healthcare-adjustdelay.component';
import { PersonalcareAdjustdelayComponent } from './learnmore-adjustdelay/personalcare-adjustdelay/personalcare-adjustdelay.component';
import { ProfessionalAdjustdelayComponent } from './learnmore-adjustdelay/professional-adjustdelay/professional-adjustdelay.component';
import { FoodjointAdjustdelayComponent } from './learnmore-adjustdelay/foodjoint-adjustdelay/foodjoint-adjustdelay.component';
import { VastuAdjustdelayComponent } from './learnmore-adjustdelay/vastu-adjustdelay/vastu-adjustdelay.component';
import { ReligiousAdjustdelayComponent } from './learnmore-adjustdelay/religious-adjustdelay/religious-adjustdelay.component';
import { AutomobileAdjustdelayComponent } from './learnmore-adjustdelay/automobile-adjustdelay/automobile-adjustdelay.component';

import { HealthcareBprofileComponent } from './learnmore-bprofile/healthcare-bprofile/healthcare-bprofile.component';
import { PersonalcareBprofileComponent } from './learnmore-bprofile/personalcare-bprofile/personalcare-bprofile.component';
import { ProfessionalBprofileComponent } from './learnmore-bprofile/professional-bprofile/professional-bprofile.component';
import { FoodjointBprofileComponent } from './learnmore-bprofile/foodjoint-bprofile/foodjoint-bprofile.component';
import { VastuBprofileComponent } from './learnmore-bprofile/vastu-bprofile/vastu-bprofile.component';
import { ReligiousBprofileComponent } from './learnmore-bprofile/religious-bprofile/religious-bprofile.component';
import { AutomobileBprofileComponent } from './learnmore-bprofile/automobile-bprofile/automobile-bprofile.component';

import { HealthcareCheckinComponent } from './learnmore-checkin/healthcare-checkin/healthcare-checkin.component';
import { PersonalcareCheckinComponent } from './learnmore-checkin/personalcare-checkin/personalcare-checkin.component';
import { ProfessionalCheckinComponent } from './learnmore-checkin/professional-checkin/professional-checkin.component';
import { FoodjointCheckinComponent } from './learnmore-checkin/foodjoint-checkin/foodjoint-checkin.component';
import { VastuCheckinComponent } from './learnmore-checkin/vastu-checkin/vastu-checkin.component';
import { ReligiousCheckinComponent } from './learnmore-checkin/religious-checkin/religious-checkin.component';
import { AutomobileCheckinComponent } from './learnmore-checkin/automobile-checkin/automobile-checkin.component';

import { HealthcareCustomerComponent } from './learnmore-customer/healthcare-customer/healthcare-customer.component';
import { PersonalcareCustomerComponent } from './learnmore-customer/personalcare-customer/personalcare-customer.component';
import { ProfessionalCustomerComponent } from './learnmore-customer/professional-customer/professional-customer.component';
import { FoodjointCustomerComponent } from './learnmore-customer/foodjoint-customer/foodjoint-customer.component';
import { VastuCustomerComponent } from './learnmore-customer/vastu-customer/vastu-customer.component';
import { ReligiousCustomerComponent } from './learnmore-customer/religious-customer/religious-customer.component';
import { AutomobileCustomerComponent } from './learnmore-customer/automobile-customer/automobile-customer.component';

import { HealthcareKioskComponent } from './learnmore-kiosk/healthcare-kiosk/healthcare-kiosk.component';
import { PersonalcareKioskComponent } from './learnmore-kiosk/personalcare-kiosk/personalcare-kiosk.component';
import { ProfessionalKioskComponent } from './learnmore-kiosk/professional-kiosk/professional-kiosk.component';
import { FoodjointKioskComponent } from './learnmore-kiosk/foodjoint-kiosk/foodjoint-kiosk.component';
import { VastuKioskComponent } from './learnmore-kiosk/vastu-kiosk/vastu-kiosk.component';
import { ReligiousKioskComponent } from './learnmore-kiosk/religious-kiosk/religious-kiosk.component';
import { AutomobileKioskComponent } from './learnmore-kiosk/automobile-kiosk/automobile-kiosk.component';

import { HealthcareLicenseComponent } from './learnmore-license/healthcare-license/healthcare-license.component';
import { PersonalcareLicenseComponent } from './learnmore-license/personalcare-license/personalcare-license.component';
import { ProfessionalLicenseComponent } from './learnmore-license/professional-license/professional-license.component';
import { FoodjointLicenseComponent } from './learnmore-license/foodjoint-license/foodjoint-license.component';
import { VastuLicenseComponent } from './learnmore-license/vastu-license/vastu-license.component';
import { ReligiousLicenseComponent } from './learnmore-license/religious-license/religious-license.component';
import { AutomobileLicenseComponent } from './learnmore-license/automobile-license/automobile-license.component';

import { HealthcareWaitlistmanagerComponent } from './learnmore-waitlistmanager/healthcare-waitlistmanager/healthcare-waitlistmanager.component';
import { PersonalcareWaitlistmanagerComponent } from './learnmore-waitlistmanager/personalcare-waitlistmanager/personalcare-waitlistmanager.component';
import { ProfessionalWaitlistmanagerComponent } from './learnmore-waitlistmanager/professional-waitlistmanager/professional-waitlistmanager.component';
import { FoodjointWaitlistmanagerComponent } from './learnmore-waitlistmanager/foodjoint-waitlistmanager/foodjoint-waitlistmanager.component';
import { VastuWaitlistmanagerComponent } from './learnmore-waitlistmanager/vastu-waitlistmanager/vastu-waitlistmanager.component';
import { ReligiousWaitlistmanagerComponent } from './learnmore-waitlistmanager/religious-waitlistmanager/religious-waitlistmanager.component';
import { AutomobileWaitlistmanagerComponent } from './learnmore-waitlistmanager/automobile-waitlistmanager/automobile-waitlistmanager.component';

import { LearnmoreWaitlistManagerComponent } from './learnmore-waitlistmanager/learnmore-waitlistmanager.component';
import { LearnmoreCheckinComponent } from './learnmore-checkin/learnmore-checkin.component';
import { LearnmoreCustomerComponent } from './learnmore-customer/learnmore-customer.component';
import { LearnmoreKioskComponent } from './learnmore-kiosk/learnmore-kiosk.component';
import { LearnmoreLicenseComponent } from './learnmore-license/learnmore-license.component';
import { LearnmoreAdjustDelayComponent } from './learnmore-adjustdelay/learnmore-adjustdelay.component';
import { LearnmoreMiscellaneousComponent } from './learnmore-miscellaneous/learnmore-miscellaneous.component';
import { HealthcareMiscellaneousComponent } from './learnmore-miscellaneous/healthcare-miscellaneous/healthcare-miscellaneous.component';
import { PersonalcareMiscellaneousComponent } from './learnmore-miscellaneous/personalcare-miscellaneous/personalcare-miscellaneous.component';
import { ProfessionalMiscellaneousComponent } from './learnmore-miscellaneous/professional-miscellaneous/professional-miscellaneous.component';
import { LearnmoreDashboardComponent } from './learnmore-dashboard/learnmore-dashboard.component';
import { HealthcareDashboardComponent } from './learnmore-dashboard/healthcare-dashboard/healthcare-dashboard.component';
import { PersonalcareDashboardComponent } from './learnmore-dashboard/personalcare-dashboard/personalcare-dashboard.component';
import { ProfessionalDashboardComponent } from './learnmore-dashboard/professional-dashboard/professional-dashboard.component';

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
            HealthcareAdjustdelayComponent,
            PersonalcareAdjustdelayComponent,
            ProfessionalAdjustdelayComponent,
            FoodjointAdjustdelayComponent,
            VastuAdjustdelayComponent,
            ReligiousAdjustdelayComponent,
            AutomobileAdjustdelayComponent,

            HealthcareBprofileComponent,
            PersonalcareBprofileComponent,
            ProfessionalBprofileComponent,
            FoodjointBprofileComponent,
            VastuBprofileComponent,
            ReligiousBprofileComponent,
            AutomobileBprofileComponent,

            HealthcareCheckinComponent,
            PersonalcareCheckinComponent,
            ProfessionalCheckinComponent,
            FoodjointCheckinComponent,
            VastuCheckinComponent,
            ReligiousCheckinComponent,
            AutomobileCheckinComponent,

            HealthcareCustomerComponent,
            PersonalcareCustomerComponent,
            ProfessionalCustomerComponent,
            FoodjointCustomerComponent,
            VastuCustomerComponent,
            ReligiousCustomerComponent,
            AutomobileCustomerComponent,

            HealthcareKioskComponent,
            PersonalcareKioskComponent,
            ProfessionalKioskComponent,
            FoodjointKioskComponent,
            VastuKioskComponent,
            ReligiousKioskComponent,
            AutomobileKioskComponent,

            HealthcareLicenseComponent,
            PersonalcareLicenseComponent,
            ProfessionalLicenseComponent,
            FoodjointLicenseComponent,
            VastuLicenseComponent,
            ReligiousLicenseComponent,
            AutomobileLicenseComponent,

            HealthcareWaitlistmanagerComponent,
            PersonalcareWaitlistmanagerComponent,
            ProfessionalWaitlistmanagerComponent,
            FoodjointWaitlistmanagerComponent,
            VastuWaitlistmanagerComponent,
            ReligiousWaitlistmanagerComponent,
            AutomobileWaitlistmanagerComponent,

            HealthcareMiscellaneousComponent,
            PersonalcareMiscellaneousComponent,
            ProfessionalMiscellaneousComponent,

            HealthcareDashboardComponent,
            PersonalcareDashboardComponent,
            ProfessionalDashboardComponent,


        LearnmoreWaitlistManagerComponent,
        LearnmoreCheckinComponent,
        LearnmoreCustomerComponent,
        LearnmoreKioskComponent,
        LearnmoreLicenseComponent,
        LearnmoreAdjustDelayComponent,
        LearnmoreMiscellaneousComponent,
        LearnmoreDashboardComponent
       
    ],
    entryComponents: [
        LearnmoreComponent
    ],
    exports: [LearnmoreComponent]
})
export class LearnmoreModule {
}
