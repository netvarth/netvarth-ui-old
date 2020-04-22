import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
import { ProviderAppointmentDetailComponent } from './provider-appointment-detail/provider-appointment-detail.component';
const routes: Routes = [
    { path: '', component: AppointmentsComponent },
    {
        path: '',
        children: [
            { path: ':id', component: ProviderAppointmentDetailComponent }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
