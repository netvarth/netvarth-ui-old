import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatRadioModule } from "@angular/material/radio";
import { RouterModule, Routes } from "@angular/router";
import { RazorpayService } from "../../../../shared/services/razorpay.service";
import { PaymentModesModule } from "../../../../shared/modules/payment-modes/payment-modes.module";
import { PaymentComponent } from "./licensepayment.component";
import { PaytmService } from "../../../../shared/services/paytm.service";
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
    ],
    providers: [RazorpayService, PaytmService]
})
export class LicensePaymentModule{}