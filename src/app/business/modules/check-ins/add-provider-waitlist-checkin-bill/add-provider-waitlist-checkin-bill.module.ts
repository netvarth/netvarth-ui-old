import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmBoxModule } from "../../../shared/confirm-box/confirm-box.module";
import { AddProviderWaitlistCheckInBillComponent } from "./add-provider-waitlist-checkin-bill.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatOptionModule } from "@angular/material/core";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { ConfirmPaymentBoxModule } from "../../../../business/shared/confirm-paymentbox/confirm-paymentbox.module";
import { JcCouponNoteModule } from "../../../../shared/modules/jc-coupon-note/jc-coupon-note.module";
import { ConfirmPaymentLinkModule } from "../../../../business/shared/confirm-paymentlink/confirm-paymentlink.module";
const routes: Routes = [
    {path:'', component: AddProviderWaitlistCheckInBillComponent}
]
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatInputModule,
        MatExpansionModule,
        MatOptionModule,
        MatAutocompleteModule,
        ConfirmPaymentBoxModule,
        JcCouponNoteModule,
        ConfirmBoxModule,
        ConfirmPaymentLinkModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [AddProviderWaitlistCheckInBillComponent],
    declarations: [AddProviderWaitlistCheckInBillComponent]
})
export class AddProviderWaitlistCheckinBillModule {}