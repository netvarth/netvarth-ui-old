import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumerPaymentsComponent } from './payments.component';
import { ConsumerPaymentDetailsComponent } from './payment-details/payment-details.component';
const routes: Routes = [
    {
        path: '', component: ConsumerPaymentsComponent
    },
    {
        path: ':id', component: ConsumerPaymentDetailsComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerPaymentsRoutingModule {
}
