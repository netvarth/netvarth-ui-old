import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderSettingsComponent } from './provider-settings.component';
import { ProviderBprofileSearchComponent } from '../provider-bprofile-search/provider-bprofile-search.component';
import { ProviderDiscountsComponent } from '../provider-discounts/provider-discounts.component';
import { ProviderCouponsComponent } from '../provider-coupons/provider-coupons.component';
import { ProviderReimburseReportComponent } from '../provider-reimburse-report/provider-reimburse-report.component';
import { ViewReportComponent } from '../view-report/view-report.component';
import { ProviderJcouponDetailsComponent } from '../provider-jcoupon-details/provider-jcoupon-details.component';
import { ProviderNonworkingdaysComponent } from '../provider-nonworkingdays/provider-nonworkingdays.component';
import { ProviderItemsComponent } from '../provider-items/provider-items.component';
import { ProviderItemsDetailsComponent } from '../provider-items-details/provider-items-details.component';
import { ProviderWaitlistLocationsComponent } from '../provider-waitlist-locations/provider-waitlist-locations.component';
import { ProviderWaitlistLocationDetailComponent } from '../provider-waitlist-location-detail/provider-waitlist-location-detail.component';
import { ProviderWaitlistServicesComponent } from '../provider-waitlist-services/provider-waitlist-services.component';
import { ProviderWaitlistServiceDetailComponent } from '../provider-waitlist-service-detail/provider-waitlist-service-detail.component';
import { ProviderWaitlistQueuesComponent } from '../provider-waitlist-queues/provider-waitlist-queues.component';
import { ProviderWaitlistQueueDetailComponent } from '../provider-waitlist-queue-detail/provder-waitlist-queue-detail.component';
import { ProviderLicenseComponent } from '../provider-license/provider-license.component';
import { ProviderPaymentHistoryComponent } from '../provider-payment-history/provider-payment-history.component';
import { ProviderPaymentSettingsComponent } from '../provider-payment-settings/provider-payment-settings.component';
import { ProviderWaitlistComponent } from '../provider-waitlist/provider-waitlist.component';
import { ProviderNotificationsComponent } from '../provider-notifications/provider-notifications.component';
import { ProvidertaxSettingsComponent } from '../provider-tax-settings/provider-tax-settings.component';
import { DepartmentsComponent } from '../departments/departments.component';
import { DepartmentDetailComponent } from '../departments/details/department.details.component';
const routes: Routes = [
  { path: '', component: ProviderSettingsComponent },
  {
    path: '',
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
        component: ProviderJcouponDetailsComponent
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
          },
          {
            path: 'departments',
            component: DepartmentsComponent
          },
          {
            path: 'department/:id',
            component: DepartmentDetailComponent
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
          {
            path: 'payment/history',
            component: ProviderPaymentHistoryComponent
          }
        ]
      },
      {
        path: 'paymentsettings',
        component: ProviderPaymentSettingsComponent
      },
      {
        path: 'notifications',
        component: ProviderNotificationsComponent
      },
      {
        path: 'taxsettings',
        component: ProvidertaxSettingsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderSettingsRoutingModule {
}
