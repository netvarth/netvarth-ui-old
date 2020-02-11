import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeServiceComponent } from './homeservice.component';

const routes: Routes = [
    { path: '', component: HomeServiceComponent },
    { path: 'services', loadChildren: () => import('./services/homeservice-services.module').then(m => m.HomeserviceServicesModule)},
    { path: 'queues', loadChildren: () => import('./queues/homeservice-queues.module').then(m => m.HomeserviceQueuesModule)}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeServiceRoutingModule {

}
