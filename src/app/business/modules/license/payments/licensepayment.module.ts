import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatRadioModule } from "@angular/material/radio";
import { RouterModule, Routes } from "@angular/router";
import { PaymentModesModule } from "../../../../shared/modules/payment-modes/payment-modes.module";
import { PaymentComponent } from "./licensepayment.component";
const routes: Routes = [
    {path: '', component: PaymentComponent}
]
@NgModule({
    declarations: [PaymentComponent],
    exports: [PaymentComponent],
    imports: [
        CommonModule,
        MatRadioModule,
        PaymentModesModule,
        [RouterModule.forChild(routes)]
    ]
})
export class LicensePaymentModule{}