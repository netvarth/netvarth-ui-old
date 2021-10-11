import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderResolver } from '../ynw_provider/services/provider-resolver.service';
import { BusinessHomeComponent } from './home/business-home.component';
import { AuthGuardProviderHome, AuthGuardLogin } from '../shared/guard/auth.guard';
import { BusinessComponent } from './business.component';
import { AddProviderWaitlistCheckInBillComponent } from './modules/check-ins/add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.component';
import { ProviderbWizardComponent } from '../ynw_provider/components/provider-bwizard/provider-bwizard.component';
import { EnquiryComponent } from './modules/enquiry/enquiry.component';

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
      { path: 'profile', loadChildren: ()=> import('../shared/modules/edit-profile/edit-profile.module').then(m=>m.EditProfileModule), canActivate: [AuthGuardLogin] },
      { path: 'change-password', loadChildren: ()=>import('../shared/modules/change-password/change-password.module').then(m=>m.ChangePasswordModule), canActivate: [AuthGuardLogin] },
      { path: 'change-mobile', loadChildren: ()=>import('../shared/modules/change-mobile/change-mobile.module').then(m=>m.ChangeMobileModule), canActivate: [AuthGuardLogin] },
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
      { path: 'sportsAndEntertainement', loadChildren: () => import('./modules/learnmore/sports/sports.module').then(m => m.SportsModule) },
      { path: 'license', loadChildren: () => import('../business/modules/license/license.module').then(m => m.LicenseModule) },
      { path: 'reports', loadChildren: () => import('../business/modules/reports/reports.module').then(m => m.ReportsModule) },
      { path: 'auditlog', loadChildren: () => import('../business/modules/provider-system-auditlogs/provider-system-auditlogs.module').then(m => m.ProviderSystemAuditLogsModule) },
      { path: 'alerts', loadChildren: () => import('../business/modules/provider-system-alerts/provider-system-alerts.module').then(m => m.ProviderSystemAlertsModule) },
      { path: 'check-ins', loadChildren: () => import('../business/modules/check-ins/check-ins.module').then(m => m.CheckinsModule) },
      { path: 'bwizard', component: ProviderbWizardComponent },
      { path: 'appointments', loadChildren: () => import('./modules/appointments/appointments.module').then(m => m.AppointmentsModule) },
      { path: 'orders', loadChildren: () => import('./modules/order-dashboard/order-dashboard.module').then(m => m.OrderDashboardModule) },
      { path: 'donations', loadChildren: () => import('./modules/donations/donations.module').then(m => m.DonationsModule) },
      { path: 'enquiry', component: EnquiryComponent },
      { path: 'enquiry/chat', loadChildren: () => import('./modules/inbox-list/inbox-list.module').then(m => m.InboxListModule) },
      { path: 'secure-video', loadChildren: () => import('./modules/video-call/video-call.module').then(m=>m.VideoCallModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BusinessRoutingModule {
}
