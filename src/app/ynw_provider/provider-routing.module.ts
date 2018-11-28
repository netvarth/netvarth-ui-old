import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderComponent } from './provider.component';
import { ProviderHomeComponent } from './components/home/provider-home.component';
import { ProviderProfileComponent } from './components/provider-profile/provider-profile.component';
import { ProviderMembersComponent } from './components/provider-members/provider-members.component';
import { ProviderItemsComponent } from './components/provider-items/provider-items.component';
import { ProviderDiscountsComponent } from './components/provider-discounts/provider-discounts.component';
import { ProviderCouponsComponent } from './components/provider-coupons/provider-coupons.component';
import { ProviderItemsDetailsComponent } from './components/provider-items-details/provider-items-details.component';
import { ProviderLicenseComponent } from './components/provider-license/provider-license.component';
import { ProviderAuditLogComponent } from './components/provider-auditlogs/provider-auditlogs.component';
import { ProviderNonworkingdaysComponent } from './components/provider-nonworkingdays/provider-nonworkingdays.component';
import { ProviderTourComponent } from './components/provider-tour/provider-tour.component';
import { ProviderSettingsComponent } from './components/provider-settings/provider-settings.component';
import { ProviderBprofileSearchComponent } from './components/provider-bprofile-search/provider-bprofile-search.component';
import { VirtualFieldsComponent } from './components/virtual-fields/virtual-fields.component';
import { ProviderWaitlistComponent } from './components/provider-waitlist/provider-waitlist.component';
// import { ProviderInboxComponent } from './components/provider-inbox/provider-inbox.component';
import { ProviderbWizardComponent } from './components/provider-bwizard/provider-bwizard.component';
import { ProviderWaitlistLocationsComponent } from './components/provider-waitlist-locations/provider-waitlist-locations.component';
import { ProviderWaitlistLocationDetailComponent } from './components/provider-waitlist-location-detail/provider-waitlist-location-detail.component';
import { ProviderWaitlistServicesComponent } from './components/provider-waitlist-services/provider-waitlist-services.component';
import { ProviderWaitlistServiceDetailComponent } from './components/provider-waitlist-service-detail/provider-waitlist-service-detail.component';
import { ProviderWaitlistQueuesComponent } from './components/provider-waitlist-queues/provider-waitlist-queues.component';
import { ProviderWaitlistQueueDetailComponent } from './components/provider-waitlist-queue-detail/provder-waitlist-queue-detail.component';
import { ProviderPaymentHistoryComponent } from './components/provider-payment-history/provider-payment-history.component';
import { ProviderWaitlistCheckInDetailComponent } from './components/provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { ProviderCustomersComponent } from './components/provider-customers/provider-customers.component';
import { AuthGuardProviderHome, AuthGuardNewProviderHome, AuthGuardLogin } from '../shared/guard/auth.guard';
import { EditProfileComponent } from '../shared/modules/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../shared/modules/change-password/change-password.component';
import { ChangeMobileComponent } from '../shared/modules/change-mobile/change-mobile.component';
import { ChangeEmailComponent } from '../shared/modules/change-email/change-email.component';
import { ProviderPaymentSettingsComponent } from './components/provider-payment-settings/provider-payment-settings.component';
import { ProviderSystemAuditLogComponent } from './components/provider-system-auditlogs/provider-system-auditlogs.component';
import { ProviderSystemAlertComponent } from './components/provider-system-alerts/provider-system-alerts.component';
import { ProviderResolver } from './services/provider-resolver.service';
import { ProviderReimburseReportComponent } from './components/provider-reimburse-report/provider-reimburse-report.component';
import { ViewReportComponent } from './components/view-report/view-report.component';
import { ProviderCouponViewComponent } from './components/provider-coupon-view/provider-coupon-view.component';
import { AddProviderWaitlistCheckInBillComponent } from './components/add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.component';
const routes: Routes = [
  {
    path: '', component: ProviderComponent,
    resolve: {
      terminologies: ProviderResolver
    },
    children: [
      {
        path: '',
        component: ProviderHomeComponent,
        canActivate: [AuthGuardProviderHome]
      },
      { path: 'checkin-detail/:id', component: ProviderWaitlistCheckInDetailComponent },
      {path: 'bill/:id', component: AddProviderWaitlistCheckInBillComponent},
      { path: 'settings', component: ProviderSettingsComponent },
      {
        path: 'settings',
        children: [
          {
            path: 'bprofile-search',
            component: ProviderBprofileSearchComponent
          },
          {
            path: 'waitlist-manager',
            component: ProviderWaitlistComponent
          },
          {
            path: 'discounts',
            component: ProviderDiscountsComponent
          },
          {
            path: 'coupons',
            component: ProviderCouponsComponent
          },
          {
            path: 'coupons',
            children: [
              {
                path: 'report',
                component: ProviderReimburseReportComponent
              },
              {
                path: 'report/:id',
                component: ViewReportComponent
              }
            ]
          },
          {
            path: 'coupons/:id',
            component: ProviderCouponViewComponent
          },
          {
            path: 'holidays',
            component: ProviderNonworkingdaysComponent
          },
          {
            path: 'items',
            component: ProviderItemsComponent
          },
          {
            path: 'items/:id',
            component: ProviderItemsDetailsComponent
          },
          {
            path: 'waitlist-manager',
            children: [
              {
                path: 'locations',
                component: ProviderWaitlistLocationsComponent
              },
              {
                path: 'location-detail/:id',
                component: ProviderWaitlistLocationDetailComponent
              },
              {
                path: 'services',
                component: ProviderWaitlistServicesComponent
              },
              {
                path: 'service-detail/:id',
                component: ProviderWaitlistServiceDetailComponent
              },
              {
                path: 'queues',
                component: ProviderWaitlistQueuesComponent
              },
              {
                path: 'queue-detail/:id',
                component: ProviderWaitlistQueueDetailComponent
              }

            ]
          },
          {
            path: 'license',
            component: ProviderLicenseComponent
          },
          {
            path: 'license/:type',
            component: ProviderLicenseComponent
          },
          {
            path: 'license',
            children: [
              // {
              //   path: 'auditlog',
              //   component: ProviderAuditLogComponent
              // },
              {
                path: 'payment/history',
                component: ProviderPaymentHistoryComponent
              }
            ]
          }/*,
      {
        path: 'paymentsettings',
        component: ProviderPaymentSettingsComponent
      }*/,
          {
            path: 'paymentsettings',
            component: ProviderPaymentSettingsComponent
          }
        ]
      },
      { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-mobile', component: ChangeMobileComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-email', component: ChangeEmailComponent, canActivate: [AuthGuardLogin] },
      { path: 'members', component: ProviderMembersComponent },
      { path: 'customers', component: ProviderCustomersComponent },
      {
        path: 'inbox',
        loadChildren: '../shared/modules/inbox/inbox.module#InboxModule'
      },
      {
        path: 'auditlog', component: ProviderSystemAuditLogComponent
      },
      {
        path: 'alerts', component: ProviderSystemAlertComponent
      },
      { path: 'bwizard', component: ProviderbWizardComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRouterModule {
}
