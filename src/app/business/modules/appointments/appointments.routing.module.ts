import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
import { ProviderAppointmentDetailComponent } from './provider-appointment-detail/provider-appointment-detail.component';
import { AdjustscheduleDelayComponent } from './schedule-delay/adjust-schedule-delay.component';
const routes: Routes = [
    { path: '', component: AppointmentsComponent },
    {
        path: '',
        children: [
            { path: ':id', component: ProviderAppointmentDetailComponent },
            { path: 'adjustdelay', component: AdjustscheduleDelayComponent },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
