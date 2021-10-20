import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { VoiceConfirmModule } from "../../customers/voice-confirm/voice-confirm.module";
import { OrderActionsComponent } from "./order-actions.component";
import { CommunicationService } from "../../../../business/services/communication-service";

@NgModule({
    declarations: [OrderActionsComponent],
    exports: [OrderActionsComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        VoiceConfirmModule,
        MatCheckboxModule,
        MatRadioModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule
    ],
    providers: [
        CommunicationService
    ]
})
export class OrderActionsModule{}