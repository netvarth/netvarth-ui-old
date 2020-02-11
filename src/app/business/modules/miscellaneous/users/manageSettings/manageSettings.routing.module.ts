import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { ProviderWaitlistLocationsComponent } from '../../../ynw_provider/components/provider-waitlist-locations/provider-waitlist-locations.component';
//import { ProviderWaitlistLocationDetailComponent } from '../../../ynw_provider/components/provider-waitlist-location-detail/provider-waitlist-location-detail.component';
//import { DepartmentsComponent } from '../../../ynw_provider/components/departments/departments.component';
//import { DepartmentDetailComponent } from '../../../ynw_provider/components/departments/details/department.details.component';
import { ManageSettingsComponent } from './manageSettings.component';

const routes: Routes = [
      {path: '', component: ManageSettingsComponent},
      {path: 'services', loadChildren: () => import('./services/waitlist-services.module').then(m => m.WaitlistServicesModule)},
      {path: 'queues', loadChildren: () => import('./queues/waitlist-queues.module').then(m => m.WaitlistQueuesModule)},
      {path: 'holidays',loadChildren:() => import('./nonWorkingDay/nonWorkingDay.module').then(m => m.nonWorkingDaymodule)}
      // { path: '',
      // children: [
      //   {path: 'services', loadChildren: './manageSettings/services/waitlist-services.module#WaitlistServicesModule'},
      //   {path: 'queues', loadChildren: './manageSettings/queues/waitlist-queues.module#WaitlistQueuesModule'}]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageSettingsRoutingModule {}
