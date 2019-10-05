import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeServiceComponent } from './homeservice.component';

const routes: Routes = [
    { path: '', component: HomeServiceComponent },
    { path: 'services', loadChildren: './services/homeservice-services.module#HomeserviceServicesModule'},
    { path: 'queues', loadChildren: './queues/homeservice-queues.module#HomeserviceQueuesModule'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeServiceRoutingModule {

}
