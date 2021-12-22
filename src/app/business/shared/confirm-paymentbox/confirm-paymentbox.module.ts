import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmPaymentBoxComponent } from "./confirm-paymentbox.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule
    ],
    exports: [ConfirmPaymentBoxComponent],
    declarations: [
        ConfirmPaymentBoxComponent
    ]
})
export class ConfirmPaymentBoxModule {}