import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsumerAppointmentComponent } from './consumer-appointment.component';
import { ConsumerAppointmentLiveTrackComponent } from './livetrack/livetrack.component';
import { ConsumerAppointmentPaymentComponent } from './payment/payment.component';
const routes: Routes = [
    { path: '', component: ConsumerAppointmentComponent},
    { path: 'payment/:id', component: ConsumerAppointmentPaymentComponent},
    { path: 'track/:id', component: ConsumerAppointmentLiveTrackComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerAppointmentRoutingModule { }
