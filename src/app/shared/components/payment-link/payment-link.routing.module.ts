import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentLinkComponent } from "./payment-link.component";
const routes: Routes = [
    { path: '', component: PaymentLinkComponent }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentLinkRoutingModule {
    
    
}