import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsumerCheckinComponent } from './consumer-checkin.component';
import { ConsumerLiveTrackComponent } from './livetrack/livetrack.component';
import { ConsumerPaymentComponent } from './payment/payment.component';
import { ConsumerCheckinHistoryComponent } from './history/checkin-history.component';
import { ConsumerCheckinBillComponent } from './checkin-bill/checkin-bill.component';
import { ConfirmPageComponent } from './confirm-page/confirm-page.component';
const routes: Routes = [
    { path: '', component: ConsumerCheckinComponent },
    { path: 'payment/:id', component: ConsumerPaymentComponent },
    { path: 'track/:id', component: ConsumerLiveTrackComponent },
    { path: 'history', component: ConsumerCheckinHistoryComponent },
    { path: 'bill', component: ConsumerCheckinBillComponent },
    { path: 'confirm', component: ConfirmPageComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerCheckinRoutingModule { }
