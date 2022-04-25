import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { JcCouponNoteModule } from "../../../../../shared/modules/jc-coupon-note/jc-coupon-note.module";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { ConsumerAppointmentBillComponent } from "./appointment-bill.component";
import { MatRadioModule } from '@angular/material/radio';
import { PaymentModesModule } from "../../../../../shared/modules/payment-modes/payment-modes.module";
import { RazorpayService } from "../../../../../shared/services/razorpay.service";
import { PaytmService } from "../../../../../shared/services/paytm.service";
const routes: Routes = [
    { path: '', component: ConsumerAppointmentBillComponent }
];
@NgModule({
    imports:[
        [RouterModule.forChild(routes)],
        MatDialogModule,
        MatTooltipModule,
        LoadingSpinnerModule,
        CommonModule,
        HeaderModule,
        MatCheckboxModule,
        FormsModule,
        JcCouponNoteModule,
        CapitalizeFirstPipeModule,
        PaymentModesModule,
        MatRadioModule
    ],
    exports:[ConsumerAppointmentBillComponent],
    declarations:[ConsumerAppointmentBillComponent],
    providers: [RazorpayService, PaytmService]
})
export class ConsumerApptBillModule{}