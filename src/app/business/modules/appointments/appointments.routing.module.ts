import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
const routes: Routes = [
    { path: '', component: AppointmentsComponent },
    {
        path: '',
        children: [
            { path: ':id', loadChildren: () => import('../check-ins/provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.module').then(m => m.ProviderWaitlistCheckInDetailModule) }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
