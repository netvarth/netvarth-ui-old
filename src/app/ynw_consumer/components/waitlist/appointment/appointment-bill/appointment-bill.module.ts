import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { JcCouponNoteModule } from "../../../../../ynw_provider/components/jc-coupon-note/jc-coupon-note.module";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { ConsumerAppointmentBillComponent } from "./appointment-bill.component";
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
        CapitalizeFirstPipeModule
    ],
    exports:[ConsumerAppointmentBillComponent],
    declarations:[ConsumerAppointmentBillComponent]
})
export class ConsumerApptBillModule{}