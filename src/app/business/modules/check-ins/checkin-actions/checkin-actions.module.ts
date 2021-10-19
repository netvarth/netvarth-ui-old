import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ListRecordingsModule } from "../../../../shared/components/list-recordings-dialog/list-recordings-dialog.module";
import { CheckinActionsComponent } from "./checkin-actions.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatChipsModule } from "@angular/material/chips";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { ConfirmBoxModule } from "../../../shared/confirm-box/confirm-box.module";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { VoiceConfirmModule } from "../../customers/voice-confirm/voice-confirm.module";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        ListRecordingsModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatInputModule,
        MatChipsModule,
        NgxQRCodeModule,
        ConfirmBoxModule,
        CapitalizeFirstPipeModule,
        VoiceConfirmModule
    ],
    exports: [
        CheckinActionsComponent
    ],
    declarations: [
        CheckinActionsComponent
    ]
})
export class CheckinsActionsModule {}