import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsumerCheckinComponent } from './consumer-checkin.component';
import { ConsumerLiveTrackComponent } from './livetrack/livetrack.component';
import { ConsumerPaymentComponent } from './payment/payment.component';
import { ConsumerWaitlistHistoryComponent } from '../../../../shared/components/consumer-waitlist-history/consumer-waitlist-history.component';
import { ConsumerCheckinHistoryComponent } from './history/checkin-history.component';
const routes: Routes = [
    { path: '', component: ConsumerCheckinComponent},
    { path: 'payment/:id', component: ConsumerPaymentComponent},
    { path: 'track/:id', component: ConsumerLiveTrackComponent},
    { path: 'history', component: ConsumerCheckinHistoryComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerCheckinRoutingModule { }
