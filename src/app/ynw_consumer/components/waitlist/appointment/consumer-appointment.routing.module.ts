import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsumerAppointmentComponent } from './consumer-appointment.component';
//import { ConsumerLiveTrackComponent } from './livetrack/livetrack.component';
//import { ConsumerPaymentComponent } from './payment/payment.component';
const routes: Routes = [
    { path: '', component: ConsumerAppointmentComponent},
   // { path: 'payment/:id', component: ConsumerPaymentComponent},
    //{ path: 'track/:id', component: ConsumerLiveTrackComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerAppointmentRoutingModule { }
