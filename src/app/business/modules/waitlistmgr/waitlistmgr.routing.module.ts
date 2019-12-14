import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderWaitlistLocationsComponent } from '../../../ynw_provider/components/provider-waitlist-locations/provider-waitlist-locations.component';
import { ProviderWaitlistLocationDetailComponent } from '../../../ynw_provider/components/provider-waitlist-location-detail/provider-waitlist-location-detail.component';
import { DepartmentsComponent } from '../../../ynw_provider/components/departments/departments.component';
import { DepartmentDetailComponent } from '../../../ynw_provider/components/departments/details/department.details.component';
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
    {path: 'locations', loadChildren: '../../../business/modules/waitlistmgr/locations/locations-list.module#LocationListModule'},
      {path: 'services', loadChildren: '../../../business/modules/waitlistmgr/services/waitlist-services.module#WaitlistServicesModule'},
      {path: 'queues', loadChildren: '../../../business/modules/waitlistmgr/queues/waitlist-queues.module#WaitlistQueuesModule'},
      {
        path: 'departments',
        component: DepartmentsComponent
      },
      {
        path: 'department/:id',
        component: DepartmentDetailComponent
      },
      {path: 'displayboards', loadChildren: '../../../business/modules/waitlistmgr/displayboards/displayboards.module#DisplayboardsModule'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WaitlistMgrRoutingModule {}
