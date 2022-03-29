import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { VoicecallConfirmBoxModule } from "../confirm-box/voicecall-confirm-box.module";
import { VoiceConfirmComponent } from "./voice-confirm.component";

@NgModule({
    declarations: [VoiceConfirmComponent],
    exports: [VoiceConfirmComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        VoicecallConfirmBoxModule
    ]
})
export class VoiceConfirmModule{}