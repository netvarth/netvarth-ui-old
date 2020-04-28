import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsumerDonationComponent } from './consumer-donation.component';
import { ConsumerDonationPaymentComponent } from './payment/payment.component';
const routes: Routes = [
    { path: '', component: ConsumerDonationComponent},
    { path: 'payment/:id', component: ConsumerDonationPaymentComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerDonationRoutingModule { }
