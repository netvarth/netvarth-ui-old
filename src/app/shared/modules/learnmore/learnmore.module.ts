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
import { FinanceAdjustdelayComponent } from './learnmore-adjustdelay/finance-adjustdelay/finance-adjustdelay.component';
import { VeterinaryAdjustdelayComponent } from './learnmore-adjustdelay/veterinary-adjustdelay/veterinary-adjustdelay.component';

import { HealthcareBprofileComponent } from './learnmore-bprofile/healthcare-bprofile/healthcare-bprofile.component';
import { PersonalcareBprofileComponent } from './learnmore-bprofile/personalcare-bprofile/personalcare-bprofile.component';
import { ProfessionalBprofileComponent } from './learnmore-bprofile/professional-bprofile/professional-bprofile.component';
import { FoodjointBprofileComponent } from './learnmore-bprofile/foodjoint-bprofile/foodjoint-bprofile.component';
import { VastuBprofileComponent } from './learnmore-bprofile/vastu-bprofile/vastu-bprofile.component';
import { ReligiousBprofileComponent } from './learnmore-bprofile/religious-bprofile/religious-bprofile.component';
import { AutomobileBprofileComponent } from './learnmore-bprofile/automobile-bprofile/automobile-bprofile.component';
import { FinanceBprofileComponent } from './learnmore-bprofile/finance-bprofile/finance-bprofile.component';
import { VeterinaryBprofileComponent } from './learnmore-bprofile/veterinary-bprofile/veterinary-bprofile.component';

import { FinanceCheckinComponent } from './learnmore-checkin/finance-checkin/finance-checkin.component';
import { HealthcareCheckinComponent } from './learnmore-checkin/healthcare-checkin/healthcare-checkin.component';
import { PersonalcareCheckinComponent } from './learnmore-checkin/personalcare-checkin/personalcare-checkin.component';
import { ProfessionalCheckinComponent } from './learnmore-checkin/professional-checkin/professional-checkin.component';
import { FoodjointCheckinComponent } from './learnmore-checkin/foodjoint-checkin/foodjoint-checkin.component';
import { VastuCheckinComponent } from './learnmore-checkin/vastu-checkin/vastu-checkin.component';
import { ReligiousCheckinComponent } from './learnmore-checkin/religious-checkin/religious-checkin.component';
import { AutomobileCheckinComponent } from './learnmore-checkin/automobile-checkin/automobile-checkin.component';
import { VeterinaryCheckinComponent } from './learnmore-checkin/veterinary-checkin/veterinary-checkin.component';


import { HealthcareCustomerComponent } from './learnmore-customer/healthcare-customer/healthcare-customer.component';
import { PersonalcareCustomerComponent } from './learnmore-customer/personalcare-customer/personalcare-customer.component';
import { ProfessionalCustomerComponent } from './learnmore-customer/professional-customer/professional-customer.component';
import { FoodjointCustomerComponent } from './learnmore-customer/foodjoint-customer/foodjoint-customer.component';
import { VastuCustomerComponent } from './learnmore-customer/vastu-customer/vastu-customer.component';
import { ReligiousCustomerComponent } from './learnmore-customer/religious-customer/religious-customer.component';
import { AutomobileCustomerComponent } from './learnmore-customer/automobile-customer/automobile-customer.component';
import { FinanceCustomerComponent } from './learnmore-customer/finance-customer/finance-customer.component';
import { VeterinaryCustomerComponent } from './learnmore-customer/veterinary-customer/veterinary-customer.component';


import { HealthcareKioskComponent } from './learnmore-kiosk/healthcare-kiosk/healthcare-kiosk.component';
import { PersonalcareKioskComponent } from './learnmore-kiosk/personalcare-kiosk/personalcare-kiosk.component';
import { ProfessionalKioskComponent } from './learnmore-kiosk/professional-kiosk/professional-kiosk.component';
import { FoodjointKioskComponent } from './learnmore-kiosk/foodjoint-kiosk/foodjoint-kiosk.component';
import { VastuKioskComponent } from './learnmore-kiosk/vastu-kiosk/vastu-kiosk.component';
import { ReligiousKioskComponent } from './learnmore-kiosk/religious-kiosk/religious-kiosk.component';
import { AutomobileKioskComponent } from './learnmore-kiosk/automobile-kiosk/automobile-kiosk.component';
import { FinanceKioskComponent } from './learnmore-kiosk/finance-kiosk/finance-kiosk.component';

import { HealthcareLicenseComponent } from './learnmore-license/healthcare-license/healthcare-license.component';
import { PersonalcareLicenseComponent } from './learnmore-license/personalcare-license/personalcare-license.component';
import { ProfessionalLicenseComponent } from './learnmore-license/professional-license/professional-license.component';
import { FoodjointLicenseComponent } from './learnmore-license/foodjoint-license/foodjoint-license.component';
import { VastuLicenseComponent } from './learnmore-license/vastu-license/vastu-license.component';
import { ReligiousLicenseComponent } from './learnmore-license/religious-license/religious-license.component';
import { AutomobileLicenseComponent } from './learnmore-license/automobile-license/automobile-license.component';
import { FinanceLicenseComponent } from './learnmore-license/finance-license/finance-license.component';
import { VeterinaryLicenseComponent } from './learnmore-license/veterinary-license/veterinary-license.component';

import { HealthcareWaitlistmanagerComponent } from './learnmore-waitlistmanager/healthcare-waitlistmanager/healthcare-waitlistmanager.component';
import { PersonalcareWaitlistmanagerComponent } from './learnmore-waitlistmanager/personalcare-waitlistmanager/personalcare-waitlistmanager.component';
import { ProfessionalWaitlistmanagerComponent } from './learnmore-waitlistmanager/professional-waitlistmanager/professional-waitlistmanager.component';
import { FoodjointWaitlistmanagerComponent } from './learnmore-waitlistmanager/foodjoint-waitlistmanager/foodjoint-waitlistmanager.component';
import { VastuWaitlistmanagerComponent } from './learnmore-waitlistmanager/vastu-waitlistmanager/vastu-waitlistmanager.component';
import { ReligiousWaitlistmanagerComponent } from './learnmore-waitlistmanager/religious-waitlistmanager/religious-waitlistmanager.component';
import { AutomobileWaitlistmanagerComponent } from './learnmore-waitlistmanager/automobile-waitlistmanager/automobile-waitlistmanager.component';
import { FinanceWaitlistmanagerComponent } from './learnmore-waitlistmanager/finance-waitlistmanager/finance-waitlistmanager.component';
import { VeterinaryWaitlistmanagerComponent } from './learnmore-waitlistmanager/veterinary-waitlistmanager/veterinary-waitlistmanager.component';

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
import { FinanceMiscellaneousComponent } from './learnmore-miscellaneous/finance-miscellaneous/finance-miscellaneous.component';
import { FoodjointMiscellaneousComponent } from './learnmore-miscellaneous/foodjoint-miscellaneous/foodjoint-miscellaneous.component';
import { VastuMiscellaneousComponent } from './learnmore-miscellaneous/vastu-miscellaneous/vastu-miscellaneous.component';
import { VeterinaryMiscellaneousComponent } from './learnmore-miscellaneous/veterinary-miscellaneous/veterinary-miscellaneous.component';
import { ReligiousMiscellaneousComponent } from './learnmore-miscellaneous/religious-miscellaneous/religious-miscellaneous.component';

import { LearnmoreDashboardComponent } from './learnmore-dashboard/learnmore-dashboard.component';
import { HealthcareDashboardComponent } from './learnmore-dashboard/healthcare-dashboard/healthcare-dashboard.component';
import { PersonalcareDashboardComponent } from './learnmore-dashboard/personalcare-dashboard/personalcare-dashboard.component';
import { ProfessionalDashboardComponent } from './learnmore-dashboard/professional-dashboard/professional-dashboard.component';
import { FinanceDashboardComponent } from './learnmore-dashboard/finance-dashboard/finance-dashboard.component';
import { FoodjointDashboardComponent } from './learnmore-dashboard/foodjoint-dashboard/foodjoint-dashboard.component';
import { VastuDashboardComponent } from './learnmore-dashboard/vastu-dashboard/vastu-dashboard.component';
import { VeterinaryDashboardComponent } from './learnmore-dashboard/veterinary-dashboard/veterinary-dashboard.component';
import { ReligiousDashboardComponent } from './learnmore-dashboard/religious-dashboard/religious-dashboard.component';

import { LearnmorePaymentsettingsComponent } from './learnmore-paymentsettings/learnmore-paymentsettings.component';
import { HealthcarePaymentsettingsComponent } from './learnmore-paymentsettings/healthcare-paymentsettings/healthcare-paymentsettings.component';
import { PersonalcarePaymentsettingsComponent } from './learnmore-paymentsettings/personalcare-paymentsettings/personalcare-paymentsettings.component';
import { ProfessionalPaymentsettingsComponent } from './learnmore-paymentsettings/professional-paymentsettings/professional-paymentsettings.component';
import { FinancePaymentsettingsComponent } from './learnmore-paymentsettings/finance-paymentsettings/finance-paymentsettings.component';
import { FoodjointPaymentsettingsComponent } from './learnmore-paymentsettings/foodjoint-paymentsettings/foodjoint-paymentsettings.component';
import { VastuPaymentsettingsComponent } from './learnmore-paymentsettings/vastu-paymentsettings/vastu-paymentsettings.component';
import { VeterinaryPaymentsettingsComponent } from './learnmore-paymentsettings/veterinary-paymentsettings/veterinary-paymentsettings.component';
import { ReligiousPaymentsettingsComponent } from './learnmore-paymentsettings/religious-paymentsettings/religious-paymentsettings.component';

import { LearnmoreBillingComponent } from './learnmore-billing/learnmore-billing.component';
import { HealthcareBillingComponent } from './learnmore-billing/healthcare-billing/healthcare-billing.component';
import { PersonalcareBillingComponent } from './learnmore-billing/personalcare-billing/personalcare-billing.component';
import { ProfessionalBillingComponent } from './learnmore-billing/professional-billing/professional-billing.component';
import { FinanceBillingComponent } from './learnmore-billing/finance-billing/finance-billing.component';
import { FoodjointBillingComponent } from './learnmore-billing/foodjoint-billing/foodjoint-billing.component';
import { VastuBillingComponent } from './learnmore-billing/vastu-billing/vastu-billing.component';
import { VeterinaryBillingComponent } from './learnmore-billing/veterinary-billing/veterinary-billing.component';
import { ReligiousBillingComponent } from './learnmore-billing/religious-billing/religious-billing.component';

import { LearnmoreProviderProfileComponent } from './learnmore-provider-profile/learnmore-provider-profile.component';
import { HealthcareProviderProfileComponent } from './learnmore-provider-profile/healthcare-provider-profile/healthcare-provider-profile.component';
import { PersonalcareProviderProfileComponent } from './learnmore-provider-profile/personalcare-provider-profile/personalcare-provider-profile.component';
import { ProfessionalProviderProfileComponent } from './learnmore-provider-profile/professional-provider-profile/professional-provider-profile.component';
import { FinanceProviderProfileComponent } from './learnmore-provider-profile/finance-provider-profile/finance-provider-profile.component';
import { FoodjointProviderProfileComponent } from './learnmore-provider-profile/foodjoint-provider-profile/foodjoint-provider-profile.component';
import { VastuProviderProfileComponent } from './learnmore-provider-profile/vastu-provider-profile/vastu-provider-profile.component';
import { VeterinaryProviderProfileComponent } from './learnmore-provider-profile/veterinary-provider-profile/veterinary-provider-profile.component';

import { LearnmoreDownpanelOptionsComponent } from './learnmore-downpanel-options/learnmore-downpanel-options.component';
import { HealthcareDownpanelOptionsComponent } from './learnmore-downpanel-options/healthcare-downpanel-options/healthcare-downpanel-options.component';
import { PersonalcareDownpanelOptionsComponent } from './learnmore-downpanel-options/personalcare-downpanel-options/personalcare-downpanel-options.component';
import { ProfessionalDownpanelOptionsComponent } from './learnmore-downpanel-options/professional-downpanel-options/professional-downpanel-options.component';
import { FinanceDownpanelOptionsComponent } from './learnmore-downpanel-options/finance-downpanel-options/finance-downpanel-options.component';
import { FoodjointDownpanelOptionsComponent } from './learnmore-downpanel-options/foodjoint-downpanel-options/foodjoint-downpanel-options.component';
import { VastuDownpanelOptionsComponent } from './learnmore-downpanel-options/vastu-downpanel-options/vastu-downpanel-options.component';
import { VeterinaryDownpanelOptionsComponent } from './learnmore-downpanel-options/veterinary-downpanel-options/veterinary-downpanel-options.component';
import { ReligiousDownpanelOptionsComponent } from './learnmore-downpanel-options/religious-downpanel-options/religious-downpanel-options.component';
import { ReligiousProviderProfileComponent } from './learnmore-provider-profile/religious-provider-profile/religious-provider-profile.component';


import { ConsumerLearnmoreComponent } from './consumer-learnmore/consumer-learnmore.component';
import { VeterinaryKioskComponent } from './learnmore-kiosk/veterinary-kiosk/veterinary-kiosk.component';


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
            FinanceAdjustdelayComponent,
            VeterinaryAdjustdelayComponent,

            HealthcareBprofileComponent,
            PersonalcareBprofileComponent,
            ProfessionalBprofileComponent,
            FoodjointBprofileComponent,
            VastuBprofileComponent,
            ReligiousBprofileComponent,
            AutomobileBprofileComponent,
            FinanceBprofileComponent,
            VeterinaryBprofileComponent,

            HealthcareCheckinComponent,
            PersonalcareCheckinComponent,
            ProfessionalCheckinComponent,
            FoodjointCheckinComponent,
            VastuCheckinComponent,
            ReligiousCheckinComponent,
            AutomobileCheckinComponent,
            FinanceCheckinComponent,
            VeterinaryCheckinComponent,

            HealthcareCustomerComponent,
            PersonalcareCustomerComponent,
            ProfessionalCustomerComponent,
            FoodjointCustomerComponent,
            VastuCustomerComponent,
            ReligiousCustomerComponent,
            AutomobileCustomerComponent,
            FinanceCustomerComponent,
            VeterinaryCustomerComponent,

            HealthcareKioskComponent,
            PersonalcareKioskComponent,
            ProfessionalKioskComponent,
            FoodjointKioskComponent,
            VastuKioskComponent,
            ReligiousKioskComponent,
            AutomobileKioskComponent,
            FinanceKioskComponent,

            HealthcareLicenseComponent,
            PersonalcareLicenseComponent,
            ProfessionalLicenseComponent,
            FoodjointLicenseComponent,
            VastuLicenseComponent,
            ReligiousLicenseComponent,
            AutomobileLicenseComponent,
            FinanceLicenseComponent,
            VeterinaryLicenseComponent,

            HealthcareWaitlistmanagerComponent,
            PersonalcareWaitlistmanagerComponent,
            ProfessionalWaitlistmanagerComponent,
            FoodjointWaitlistmanagerComponent,
            VastuWaitlistmanagerComponent,
            ReligiousWaitlistmanagerComponent,
            AutomobileWaitlistmanagerComponent,
            FinanceWaitlistmanagerComponent,
            VeterinaryWaitlistmanagerComponent,

            HealthcareMiscellaneousComponent,
            PersonalcareMiscellaneousComponent,
            ProfessionalMiscellaneousComponent,
            FinanceMiscellaneousComponent,
            FoodjointMiscellaneousComponent,
            VastuMiscellaneousComponent,
            VeterinaryMiscellaneousComponent,
            ReligiousMiscellaneousComponent,

            HealthcareDashboardComponent,
            PersonalcareDashboardComponent,
            ProfessionalDashboardComponent,
            FinanceDashboardComponent,
            FoodjointDashboardComponent,
            VastuDashboardComponent,
            VeterinaryDashboardComponent,
            ReligiousDashboardComponent,

            HealthcarePaymentsettingsComponent,
            PersonalcarePaymentsettingsComponent,
            ProfessionalPaymentsettingsComponent,
            FinancePaymentsettingsComponent,
            FoodjointPaymentsettingsComponent,
            VastuPaymentsettingsComponent,
            VeterinaryPaymentsettingsComponent,
            ReligiousPaymentsettingsComponent,

            HealthcareBillingComponent,
            PersonalcareBillingComponent,
            ProfessionalBillingComponent,
            FinanceBillingComponent,
            FoodjointBillingComponent,
            VastuBillingComponent,
            VeterinaryBillingComponent,
            ReligiousBillingComponent,

            HealthcareProviderProfileComponent,
            PersonalcareProviderProfileComponent,
            ProfessionalProviderProfileComponent,
            FinanceProviderProfileComponent,
            FoodjointProviderProfileComponent,
            VastuProviderProfileComponent,
            VeterinaryProviderProfileComponent,
            ReligiousProviderProfileComponent,

            HealthcareDownpanelOptionsComponent,
            PersonalcareDownpanelOptionsComponent,
            ProfessionalDownpanelOptionsComponent,
            FinanceDownpanelOptionsComponent,
            FoodjointDownpanelOptionsComponent,
            VastuDownpanelOptionsComponent,
            VeterinaryDownpanelOptionsComponent,
            ReligiousDownpanelOptionsComponent,

        LearnmoreWaitlistManagerComponent,
        LearnmoreCheckinComponent,
        LearnmoreCustomerComponent,
        LearnmoreKioskComponent,
        LearnmoreLicenseComponent,
        LearnmoreAdjustDelayComponent,
        LearnmoreMiscellaneousComponent,
        LearnmoreDashboardComponent,
        LearnmorePaymentsettingsComponent,
        LearnmoreBillingComponent,
        LearnmoreProviderProfileComponent,
        PersonalcareProviderProfileComponent,
        LearnmoreDownpanelOptionsComponent,
        ConsumerLearnmoreComponent,
        VeterinaryKioskComponent,
       
    ],
    entryComponents: [
        LearnmoreComponent
    ],
    exports: [LearnmoreComponent]
})
export class LearnmoreModule {
}

