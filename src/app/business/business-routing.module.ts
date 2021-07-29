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
import { ChangePasswordComponent } from '../shared/modules/change-password/change-password.component';
import { ChangeMobileComponent } from '../shared/modules/change-mobile/change-mobile.component';
import { ProviderbWizardComponent } from '../ynw_provider/components/provider-bwizard/provider-bwizard.component';
import { EnquiryComponent } from './modules/enquiry/enquiry.component';
import { VideoCallSharedComponent } from './modules/video-call/video-call.component';

const routes: Routes = [
  {
    path: '', component: BusinessComponent, resolve: { terminologies: ProviderResolver },
    children: [
      { path: '', component: BusinessHomeComponent, canActivate: [AuthGuardProviderHome] },
      { path: 'faq', loadChildren: () => import('./modules/faq/provider-faq.module').then(m => m.ProviderFaqModule) },
      { path: 'customers', loadChildren: () => import('./modules/customers/customers.module').then(m => m.CustomersModule) },
      { path: 'telehealth', loadChildren: () => import('./modules/teleservice/teleservice.module').then(m => m.TeleServiceModule) },
      { path: 'bill/:id', component: AddProviderWaitlistCheckInBillComponent },
      { path: 'settings', loadChildren: () => import('../ynw_provider/components/provider-settings/provider-settings.module').then(m => m.ProviderSettingsModule) },
      { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-mobile', component: ChangeMobileComponent, canActivate: [AuthGuardLogin] },
      { path: 'inbox', loadChildren: () => import('./modules/inbox-list/inbox-list.module').then(m => m.InboxListModule) },
      { path: 'finance', loadChildren: () => import('./modules/learnmore/finance/finance.module').then(m => m.FinanceModule) },
      { path: 'foodJoints', loadChildren: () => import('./modules/learnmore/foodjoints/foodjoints.module').then(m => m.FoodjointsModule) },
      { path: 'healthCare', loadChildren: () => import('./modules/learnmore/healthcare/healthcare.module').then(m => m.HealthcareModule) },
      { path: 'personalCare', loadChildren: () => import('./modules/learnmore/personalcare/personalcare.module').then(m => m.PersonalcareModule) },
      { path: 'professionalConsulting', loadChildren: () => import('./modules/learnmore/professional/professional.module').then(m => m.ProfessionalcareModule) },
      { path: 'religiousPriests', loadChildren: () => import('./modules/learnmore/religious/religious.module').then(m => m.ReligiousModule) },
      { path: 'vastuAstrology', loadChildren: () => import('./modules/learnmore/vastu/vastu.module').then(m => m.VastuModule) },
      { path: 'veterinaryPetcare', loadChildren: () => import('./modules/learnmore/veterinary/veterinary.module').then(m => m.VeterinaryModule) },
      { path: 'retailStores', loadChildren: () => import('./modules/learnmore/retailstores/retailstores.module').then(m => m.RetailStoresModule) },
      { path: 'otherMiscellaneous', loadChildren: () => import('./modules/learnmore/otherMiscellaneous/otherMiscellaneous.module').then(m => m.OtherMiscellaneousModule) },
      { path: 'educationalInstitution', loadChildren: () => import('./modules/learnmore/educationInstitution/education.module').then(m => m.EducationModule) },
      { path: 'license', loadChildren: () => import('../business/modules/license/license.module').then(m => m.LicenseModule) },
      { path: 'reports', loadChildren: () => import('../business/modules/reports/reports.module').then(m => m.ReportsModule) },
      { path: 'auditlog', component: ProviderSystemAuditLogComponent },
      { path: 'alerts', component: ProviderSystemAlertComponent },
      { path: 'check-ins', loadChildren: () => import('../business/modules/check-ins/check-ins.module').then(m => m.CheckinsModule) },
      { path: 'bwizard', component: ProviderbWizardComponent },
      { path: 'appointments', loadChildren: () => import('./modules/appointments/appointments.module').then(m => m.AppointmentsModule) },
      { path: 'orders', loadChildren: () => import('./modules/order-dashboard/order-dashboard.module').then(m => m.OrderDashboardModule) },
      { path: 'donations', loadChildren: () => import('./modules/donations/donations.module').then(m => m.DonationsModule) },
      { path: 'enquiry', component: EnquiryComponent },
      { path: 'enquiry/chat', loadChildren: () => import('./modules/inbox-list/inbox-list.module').then(m => m.InboxListModule) },
      { path: 'secure-video', component: VideoCallSharedComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BusinessRoutingModule {
}
