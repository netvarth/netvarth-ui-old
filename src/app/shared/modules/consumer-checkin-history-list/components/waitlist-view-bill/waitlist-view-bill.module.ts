import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { JcCouponNoteModule } from "../../../../../ynw_provider/components/jc-coupon-note/jc-coupon-note.module";
import { ViewConsumerWaitlistCheckInBillComponent } from "./waitlist-view-bill.component";

@NgModule({
    imports: [
        MatDialogModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        JcCouponNoteModule
    ],
    exports: [
        ViewConsumerWaitlistCheckInBillComponent
    ],
    declarations: [
        ViewConsumerWaitlistCheckInBillComponent
    ]
})
export class WaitlistViewBillModule {}