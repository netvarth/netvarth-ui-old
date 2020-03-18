import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitlistSchedulesComponent } from './list/waitlist-schedules.component';
import { WaitlistSchedulesDetailComponent } from './details/waitlist-schedulesdetail.component';

const routes: Routes = [
    { path: '', component: WaitlistSchedulesComponent },
    { path: ':sid', component: WaitlistSchedulesDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WaitlistSchedulesRoutingModule {}
