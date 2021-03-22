import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitlistMgrComponent } from './waitlistmgr.component';

const routes: Routes = [
    { path: '', component: WaitlistMgrComponent },
    { path: 'services', loadChildren: () => import('../../../../business/modules/settings/waitlistmgr/services/waitlist-services.module').then(m => m.WaitlistServicesModule) },
    { path: 'queues', loadChildren: () => import('../../../../business/modules/settings/waitlistmgr/queues/waitlist-queues.module').then(m => m.WaitlistQueuesModule) },
    { path: 'displayboards', loadChildren: () => import('../../../../business/modules/settings/waitlistmgr/displayboards/displayboards.module').then(m => m.DisplayboardsModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WaitlistMgrRoutingModule { }
