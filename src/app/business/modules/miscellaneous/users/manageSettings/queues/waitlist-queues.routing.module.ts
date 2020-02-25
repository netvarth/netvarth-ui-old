import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitlistQueuesComponent } from './list/waitlist-queues.component';
import { WaitlistQueueDetailComponent } from './details/waitlist-queuedetail.component';

const routes: Routes = [
    { path: '', component: WaitlistQueuesComponent },
    { path: ':sid', component: WaitlistQueueDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WaitlistQueuesRoutingModule {}
