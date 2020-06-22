import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsumerAppointmentComponent } from './consumer-appointment.component';
import { ConsumerAppointmentLiveTrackComponent } from './livetrack/livetrack.component';
import { ConsumerAppointmentPaymentComponent } from './payment/payment.component';
import { ConsumerAppointmentHistoryComponent } from './history/appointment-history.component';
import { ConsumerAppointmentBillComponent } from './appointment-bill/appointment-bill.component';
const routes: Routes = [
    { path: '', component: ConsumerAppointmentComponent },
    { path: 'payment/:id', component: ConsumerAppointmentPaymentComponent },
    { path: 'track/:id', component: ConsumerAppointmentLiveTrackComponent },
    { path: 'history', component: ConsumerAppointmentHistoryComponent },
    { path: 'bill', component: ConsumerAppointmentBillComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerAppointmentRoutingModule { }
