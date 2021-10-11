import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { FormMessageDisplayModule } from "../../../form-message-display/form-message-display.module";
import { ConsumerWaitlistCheckInPaymentComponent } from "./checkin-payment.component";

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        FormMessageDisplayModule,
        CapitalizeFirstPipeModule,
        FormsModule,
        CommonModule
    ],
    exports: [ConsumerWaitlistCheckInPaymentComponent],
    declarations: [
        ConsumerWaitlistCheckInPaymentComponent
    ]
})
export class CheckinPaymentModule {}