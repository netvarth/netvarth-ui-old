import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderResolver } from '../ynw_provider/services/provider-resolver.service';
import { BusinessHomeComponent } from './home/business-home.component';
import { AuthGuardProviderHome, AuthGuardLogin } from '../shared/guard/auth.guard';
import { BusinessComponent } from './business.component';
import { EditProfileComponent } from '../shared/modules/edit-profile/edit-profile.component';
import { ProviderSystemAlertComponent } from '../ynw_provider/components/provider-system-alerts/provider-system-alerts.component';
import { ProviderSystemAuditLogComponent } from '../ynw_provider/components/provider-system-auditlogs/provider-system-auditlogs.component';
import { AddProviderWaitlistCheckInBillComponent } from './modules/check-ins/add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.component';
// import { ProviderWaitlistCheckInDetailComponent } from '../ynw_provider/components/provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { ChangePasswordComponent } from '../shared/modules/change-password/change-password.component';
import { ChangeMobileComponent } from '../shared/modules/change-mobile/change-mobile.component';
import { ProviderMembersComponent } from '../ynw_provider/components/provider-members/provider-members.component';
import { ProviderbWizardComponent } from '../ynw_provider/components/provider-bwizard/provider-bwizard.component';
import { ManageProviderComponent } from '../shared/components/manage-provider/manage-provider.component';

const routes: Routes = [
  {
    path: '', component: BusinessComponent, resolve: { terminologies: ProviderResolver },
    children: [
      { path: '', component: BusinessHomeComponent, canActivate: [AuthGuardProviderHome] },
      { path: 'faq', loadChildren: './modules/faq/provider-faq.module#ProviderFaqModule' },
      { path: 'kiosk', loadChildren: '../ynw_kiosk/kiosk.module#KioskModule' },
      { path: 'customers', loadChildren: '../ynw_kiosk/kiosk.module#KioskModule' },
      {path: 'bill/:id', component: AddProviderWaitlistCheckInBillComponent},
      { path: 'settings', loadChildren: '../ynw_provider/components/provider-settings/provider-settings.module#ProviderSettingsModule' },
      { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-mobile', component: ChangeMobileComponent, canActivate: [AuthGuardLogin] },
      { path: 'members', component: ProviderMembersComponent},
      { path: 'inbox', loadChildren: './modules/mailbox/mailbox.module#MailboxModule' },
      { path: 'finance', loadChildren: './modules/learnmore/finance/finance.module#FinanceModule'},
      { path: 'foodJoints', loadChildren: './modules/learnmore/foodjoints/foodjoints.module#FoodjointsModule'},
      { path: 'healthCare', loadChildren: './modules/learnmore/healthcare/healthcare.module#HealthcareModule'},
      { path: 'personalCare', loadChildren: './modules/learnmore/personalcare/personalcare.module#PersonalcareModule'},
      { path: 'professionalConsulting', loadChildren: './modules/learnmore/professional/professional.module#ProfessionalcareModule'},
      { path: 'religiousPriests', loadChildren: './modules/learnmore/religious/religious.module#ReligiousModule'},
      { path: 'vastuAstrology', loadChildren: './modules/learnmore/vastu/vastu.module#VastuModule'},
      { path: 'veterinaryPetcare', loadChildren: './modules/learnmore/veterinary/veterinary.module#VeterinaryModule'},
      { path: 'license', loadChildren: '../business/modules/license/license.module#LicenseModule' },
      { path: 'auditlog', component: ProviderSystemAuditLogComponent },
      { path: 'alerts', component: ProviderSystemAlertComponent },
      { path: 'check-ins', loadChildren: '../business/modules/check-ins/check-ins.module#CheckinsModule'},
      { path: 'bwizard', component: ProviderbWizardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BusinessRoutingModule {

}
