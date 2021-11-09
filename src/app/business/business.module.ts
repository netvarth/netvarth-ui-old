import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardLogin, AuthGuardProviderHome } from '../shared/guard/auth.guard';
import { ProviderServices } from './services/provider-services.service';
import { ProviderDataStorageService } from './services/provider-datastorage.service';
import { MessageService } from './services/provider-message.service';
import { ProviderSharedFuctions } from './functions/provider-shared-functions';
import { ProviderResolver } from './services/provider-resolver.service';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { projectConstants } from '../app.component';
import { BusinessComponent } from './business.component';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../shared/modules/loading-spinner/loading-spinner.module';
import { JoyrideModule } from 'ngx-joyride';
import { UpdateEmailModule } from './modules/update-email/update-email.module';
import { MenuModule } from './home/menu/menu.module';
import { BusinessHeaderModule } from './home/header/header.module';
const routes: Routes = [
    {
      path: '', component: BusinessComponent, resolve: { terminologies: ProviderResolver },
      children: [
        { path: '', component: BusinessComponent, canActivate: [AuthGuardProviderHome] },
        { path: 'faq', loadChildren: () => import('./modules/faq/provider-faq.module').then(m => m.ProviderFaqModule) },
        { path: 'customers', loadChildren: () => import('./modules/customers/list/customers-list.module').then(m => m.CustomersListModule) },
        { path: 'telehealth', loadChildren: () => import('./modules/teleservice/teleservice.module').then(m => m.TeleServiceModule) },
        { path: 'bill/:id', loadChildren: ()=> import('../business/modules/check-ins/add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.module').then(m=>m.AddProviderWaitlistCheckinBillModule)},
        { path: 'settings', loadChildren: () => import('../business/modules/provider-settings/provider-settings.module').then(m => m.ProviderSettingsModule) },
        { path: 'profile', loadChildren: ()=> import('../shared/modules/edit-profile/edit-profile.module').then(m=>m.EditProfileModule), canActivate: [AuthGuardLogin] },
        { path: 'change-password', loadChildren: ()=>import('../shared/modules/change-password/change-password.module').then(m=>m.ChangePasswordModule), canActivate: [AuthGuardLogin] },
        { path: 'change-mobile', loadChildren: ()=>import('../shared/modules/change-mobile/change-mobile.module').then(m=>m.ChangeMobileModule), canActivate: [AuthGuardLogin] },
        { path: 'inbox', loadChildren: () => import('./modules/inbox-list/inbox-list.module').then(m => m.BusinessInboxListModule) },
        { path: 'finance', loadChildren: () => import('./modules/learnmore/finance/finance.module').then(m => m.FinanceModule) },
        { path: 'foodJoints', loadChildren: () => import('./modules/learnmore/foodjoints/foodjoints.module').then(m => m.FoodjointsModule) },
        { path: 'healthCare', loadChildren: () => import('./modules/learnmore/healthcare/healthcare.module').then(m => m.HealthcareModule) },
        { path: 'personalCare', loadChildren: () => import('./modules/learnmore/personalcare/personalcare.module').then(m => m.PersonalcareModule) },
        { path: 'professionalConsulting', loadChildren: () => import('./modules/learnmore/professional/professional.module').then(m => m.ProfessionalcareModule) },
        { path: 'religiousPriests', loadChildren: () => import('./modules/learnmore/religious/religious.module').then(m => m.ReligiousModule) },
        { path: 'vastuAstrology', loadChildren: () => import('./modules/learnmore/vastu/vastu.module').then(m => m.VastuModule) },
        { path: 'veterinaryPetcare', loadChildren: () => import('./modules/learnmore/veterinary/veterinary.module').then(m => m.VeterinaryModule) },
        { path: 'retailStores', loadChildren: () => import('./modules/learnmore/retailstores/retailstores.module').then(m => m.RetailStoresModule) },
        { path: 'otherMiscellaneous', loadChildren: () => import('./modules/learnmore/other-miscellaneous/other-miscellaneous.module').then(m => m.OtherMiscellaneousModule) },
        { path: 'educationalInstitution', loadChildren: () => import('./modules/learnmore/educationInstitution/education.module').then(m => m.EducationModule) },
        { path: 'sportsAndEntertainement', loadChildren: () => import('./modules/learnmore/sports/sports.module').then(m => m.SportsModule) },
        { path: 'license', loadChildren: () => import('../business/modules/license/license.module').then(m => m.LicenseModule) },
        { path: 'reports', loadChildren: () => import('../business/modules/reports/reports.module').then(m => m.ReportsModule) },
        { path: 'auditlog', loadChildren: () => import('../business/modules/provider-system-auditlogs/provider-system-auditlogs.module').then(m => m.ProviderSystemAuditLogsModule) },
        { path: 'alerts', loadChildren: () => import('../business/modules/provider-system-alerts/provider-system-alerts.module').then(m => m.ProviderSystemAlertsModule) },
        { path: 'check-ins', loadChildren: () => import('../business/modules/check-ins/check-ins.module').then(m => m.CheckinsModule) },
        { path: 'bwizard', loadChildren: () => import('../business/modules/provider-bwizard/provider-bwizard.module').then(m=>m.ProviderBwizardModule)},
        { path: 'appointments', loadChildren: () => import('./modules/appointments/appointments.module').then(m => m.AppointmentsModule)},
        { path: 'orders', loadChildren: () => import('./modules/order-dashboard/order-dashboard.module').then(m => m.OrderDashboardModule)},
        { path: 'donations', loadChildren: () => import('./modules/donations/donations.module').then(m => m.DonationsModule)},
        { path: 'enquiry', loadChildren: ()=> import('../business/modules/enquiry/enquiry.module').then(m=>m.EnquiryModule)},
        { path: 'enquiry/chat', loadChildren: () => import('./modules/inbox-list/inbox-list.module').then(m => m.BusinessInboxListModule) },
        { path: 'secure-video', loadChildren: () => import('./modules/video-call/video-call.module').then(m=>m.VideoCallModule) },
        { path: 'drive', loadChildren: () => import('./modules/jaldee-drive/jaldee-drive.module').then(m=>m.JaldeeDriveModule) },
      ]
    }
  ];
@NgModule({
    declarations: [
        BusinessComponent
    ],
    imports: [
        [RouterModule.forChild(routes)],
        CommonModule,
        LoadingSpinnerModule,
        MenuModule,
        BusinessHeaderModule,
        JoyrideModule.forRoot(),
        UpdateEmailModule
    ],
    providers: [
        AuthGuardProviderHome,
        ProviderServices,
        ProviderDataStorageService,
        MessageService,
        ProviderSharedFuctions,
        ProviderResolver,
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS }
    ]
})

export class BusinessModule {

}