import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsumerDonationsComponent } from './donations.component';
import { ConsumerDonationComponent } from './details/consumer-donation.component';
import { ConfirmPageComponent } from './details/confirm-page/confirm-page.component';
const routes: Routes = [
    { path: '', component: ConsumerDonationsComponent},
    { path: 'confirm', component: ConfirmPageComponent},
    { path: ':id', component: ConsumerDonationComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerDonationRoutingModule { }
