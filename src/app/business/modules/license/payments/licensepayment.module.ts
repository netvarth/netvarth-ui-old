import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PaymentComponent } from "./licensepayment.component";
const routes: Routes = [
    {path: '', component: PaymentComponent}
]
@NgModule({
    declarations: [PaymentComponent],
    exports: [PaymentComponent],
    imports: [
        CommonModule,
        [RouterModule.forChild(routes)]
    ]
})
export class LicensePaymentModule{}