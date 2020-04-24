import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsumerDonationComponent } from './consumer-donation.component';
const routes: Routes = [
    { path: '', component: ConsumerDonationComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerDonationRoutingModule { }
