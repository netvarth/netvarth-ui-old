import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeserviceQueuesComponent } from './list/homeservice-queues.component';
import { HomeserviceQueueDetailComponent } from './details/homeservice-queuedetails.component';

const routes: Routes = [
    { path: '', component: HomeserviceQueuesComponent },
    { path: ':id', component: HomeserviceQueueDetailComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeserviceQueuesRoutingModule {}
