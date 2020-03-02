import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsumerCheckinComponent } from './consumer-checkin.component';
import { ConsumerLiveTrackComponent } from './livetrack/livetrack.component';
import { ConsumerPaymentComponent } from './payment/payment.component';
const routes: Routes = [
    { path: '', component: ConsumerCheckinComponent},
    { path: 'payment/:id', component: ConsumerPaymentComponent},
    { path: 'track', component: ConsumerLiveTrackComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerCheckinRoutingModule { }
