import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ProviderWaitlistLocationsComponent } from '../../../ynw_provider/components/provider-waitlist-locations/provider-waitlist-locations.component';
// import { ProviderWaitlistLocationDetailComponent } from '../../../ynw_provider/components/provider-waitlist-location-detail/provider-waitlist-location-detail.component';
// import { DepartmentsComponent } from '../../../ynw_provider/components/departments/departments.component';
// import { DepartmentDetailComponent } from '../../../ynw_provider/components/departments/details/department.details.component';
import { WaitlistMgrComponent } from './waitlistmgr.component';

const routes: Routes = [
    {path: '', component: WaitlistMgrComponent},
    // {
    //     path: 'locations',
    //     component: ProviderWaitlistLocationsComponent
    //   },
    //   {
    //     path: 'location-detail/:id',
    //     component: ProviderWaitlistLocationDetailComponent
    //   },
    // {path: 'locations', loadChildren: () => import('../../../business/modules/waitlistmgr/locations/locations-list.module').then(m => m.LocationListModule)},
      {path: 'services', loadChildren: () => import('../../../../business/modules/settings/waitlistmgr/services/waitlist-services.module').then(m => m.WaitlistServicesModule)},
      {path: 'queues', loadChildren: () => import('../../../../business/modules/settings/waitlistmgr/queues/waitlist-queues.module').then(m => m.WaitlistQueuesModule)},
      // {
      //   path: 'departments',
      //   component: DepartmentsComponent
      // },
      // {
      //   path: 'department/:id',
      //   component: DepartmentDetailComponent
      // },
      {path: 'displayboards', loadChildren: () => import('../../../../business/modules/settings/waitlistmgr/displayboards/displayboards.module').then(m => m.DisplayboardsModule)}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WaitlistMgrRoutingModule {}
