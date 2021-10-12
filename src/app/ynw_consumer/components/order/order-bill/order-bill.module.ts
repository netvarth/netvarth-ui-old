import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { JcCouponNoteModule } from "../../../../ynw_provider/components/jc-coupon-note/jc-coupon-note.module";
import { OrderBillComponent } from "./order-bill.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatTooltipModule,
        MatCheckboxModule,
        JcCouponNoteModule,
        LoadingSpinnerModule

    ],
    exports: [OrderBillComponent],
    declarations: [OrderBillComponent]
})
export class OrderBillModule {}