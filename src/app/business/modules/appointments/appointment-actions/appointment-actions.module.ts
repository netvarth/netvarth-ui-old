import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ConfirmBoxModule } from "../../../shared/confirm-box/confirm-box.module";
import { ListRecordingsModule } from "../../../../shared/components/list-recordings-dialog/list-recordings-dialog.module";
import { AppointmentActionsComponent } from "./appointment-actions.component";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { VoiceConfirmModule } from "../../customers/voice-confirm/voice-confirm.module";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        ListRecordingsModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatInputModule,
        MatChipsModule,
        ConfirmBoxModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule,
        NgxQRCodeModule,
        VoiceConfirmModule
    ],
    exports: [
        AppointmentActionsComponent
    ],
    declarations: [
        AppointmentActionsComponent
    ]
})
export class AppointmentActionsModule {}