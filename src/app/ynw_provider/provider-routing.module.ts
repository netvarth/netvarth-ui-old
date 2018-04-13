import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

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
import { ProviderInboxComponent } from './components/provider-inbox/provider-inbox.component';
import { ProviderbWizardComponent } from './components/provider-bwizard/provider-bwizard.component';
import { ProviderWaitlistLocationsComponent } from './components/provider-waitlist-locations/provider-waitlist-locations.component';
import { ProviderWaitlistLocationDetailComponent } from './components/provider-waitlist-location-detail/provider-waitlist-location-detail.component';
import { ProviderWaitlistServicesComponent } from './components/provider-waitlist-services/provider-waitlist-services.component';
import { ProviderWaitlistServiceDetailComponent } from './components/provider-waitlist-service-detail/provider-waitlist-service-detail.component';
import { ProviderWaitlistQueuesComponent } from './components/provider-waitlist-queues/provider-waitlist-queues.component';
import { ProviderWaitlistQueueDetailComponent } from './components/provider-waitlist-queue-detail/provder-waitlist-queue-detail.component';

import { AuthGuardProviderHome, AuthGuardNewProviderHome } from '../shared/guard/auth.guard';

const routes: Routes = [
    {path: '', component: ProviderComponent, children: [

    { path: '', component: ProviderHomeComponent, canActivate: [AuthGuardProviderHome] },
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
        path: 'license',
        children: [
          { path: 'auditlog',
            component: ProviderAuditLogComponent
          }
        ]
      }

      ]
    },
    { path: 'tour', component: ProviderTourComponent },
    { path: 'profile', component: ProviderProfileComponent },
    { path: 'members', component: ProviderMembersComponent },
    { path: 'items', component: ProviderItemsComponent },
    { path: 'items/:id', component: ProviderItemsDetailsComponent },
    { path: 'discounts', component: ProviderDiscountsComponent },
    { path: 'coupons', component: ProviderCouponsComponent },
    { path: 'fields', component: VirtualFieldsComponent},
    { path: 'holidays', component: ProviderNonworkingdaysComponent },
    { path: 'inbox', component: ProviderInboxComponent },
    { path: 'bwizard', component: ProviderbWizardComponent }
  ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProviderRouterModule {

}
