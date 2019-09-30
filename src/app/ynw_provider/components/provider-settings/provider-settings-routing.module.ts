import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderSettingsComponent } from './provider-settings.component';
import { ProviderBprofileSearchComponent } from '../provider-bprofile-search/provider-bprofile-search.component';
import { ProviderWaitlistLocationsComponent } from '../provider-waitlist-locations/provider-waitlist-locations.component';
import { ProviderWaitlistLocationDetailComponent } from '../provider-waitlist-location-detail/provider-waitlist-location-detail.component';
import { ProviderWaitlistServicesComponent } from '../provider-waitlist-services/provider-waitlist-services.component';
import { ProviderWaitlistServiceDetailComponent } from '../provider-waitlist-service-detail/provider-waitlist-service-detail.component';
import { ProviderWaitlistQueuesComponent } from '../provider-waitlist-queues/provider-waitlist-queues.component';
import { ProviderWaitlistQueueDetailComponent } from '../provider-waitlist-queue-detail/provder-waitlist-queue-detail.component';
import { ProviderWaitlistComponent } from '../provider-waitlist/provider-waitlist.component';
import { DepartmentsComponent } from '../departments/departments.component';
import { DepartmentDetailComponent } from '../departments/details/department.details.component';
const routes: Routes = [
  { path: '', component: ProviderSettingsComponent },
  {
    path: '',
    children: [
      // {
      //   path: 'bprofile-search',
      //   component: ProviderBprofileSearchComponent
      // },
      {
        path: 'waitlist-manager',
        component: ProviderWaitlistComponent
      },
      {
        path: 'bprofile',
        loadChildren: '../../../business/modules/bprofile/bprofile.module#BProfileModule'
      },
      {
        path: 'pos',
        loadChildren: '../../../business/modules/pos/pos.module#POSModule'
      },
      {
        path: 'miscellaneous',
        loadChildren: '../../../business/modules/miscellaneous/miscellaneous.module#MiscellaneousModule'
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
