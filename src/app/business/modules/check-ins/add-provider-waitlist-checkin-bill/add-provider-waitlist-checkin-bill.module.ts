import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmBoxModule } from "../../../../ynw_provider/shared/component/confirm-box/confirm-box.module";
import { JcCouponNoteModule } from "../../../../ynw_provider/components/jc-coupon-note/jc-coupon-note.module";
import { ConfirmPaymentBoxModule } from "../../../../ynw_provider/shared/component/confirm-paymentbox/confirm-paymentbox.module";
import { AddProviderWaitlistCheckInBillComponent } from "./add-provider-waitlist-checkin-bill.component";
import { ConfirmPaymentLinkModule } from "../../../../ynw_provider/shared/component/confirm-paymentlink/confirm-paymentlink.module";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        ConfirmPaymentBoxModule,
        JcCouponNoteModule,
        ConfirmBoxModule,
        ConfirmPaymentLinkModule
    ],
    exports: [AddProviderWaitlistCheckInBillComponent],
    declarations: [AddProviderWaitlistCheckInBillComponent]
})
export class AddProviderWaitlistCheckinBillModule {}