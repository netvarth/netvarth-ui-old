import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitlistuserSchedulesComponent } from './list/waitlist-schedules.component';
import { WaitlistuserSchedulesDetailComponent } from './details/waitlist-schedulesdetail.component';

const routes: Routes = [
    { path: '', component: WaitlistuserSchedulesComponent },
    { path: ':sid', component: WaitlistuserSchedulesDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WaitlistuserSchedulesRoutingModule {}
