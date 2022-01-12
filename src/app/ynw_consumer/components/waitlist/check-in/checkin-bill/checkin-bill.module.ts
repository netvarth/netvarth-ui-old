import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConsumerCheckinBillComponent } from "./checkin-bill.component";
import { JcCouponNoteModule } from "../../../../../shared/modules/jc-coupon-note/jc-coupon-note.module";
import { MatRadioModule } from "@angular/material/radio";
import { PaymentModesModule } from "../../../../../shared/modules/payment-modes/payment-modes.module";
const routes: Routes = [
    { path: '', component: ConsumerCheckinBillComponent }
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
        MatRadioModule,
        PaymentModesModule,
        CapitalizeFirstPipeModule
    ],
    exports:[ConsumerCheckinBillComponent],
    declarations:[ConsumerCheckinBillComponent]
})
export class ConsumerCheckinBillModule{}