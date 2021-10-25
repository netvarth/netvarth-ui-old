import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { JcCouponNoteModule } from "../../../../shared/modules/jc-coupon-note/jc-coupon-note.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { OrderBillComponent } from "./order-bill.component";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
const routes: Routes= [
    {path: '', component: OrderBillComponent}
]
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HeaderModule,
        MatDialogModule,
        MatTooltipModule,
        MatCheckboxModule,
        JcCouponNoteModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [OrderBillComponent],
    declarations: [OrderBillComponent]
})
export class OrderBillModule {}