import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { VoicecallConfirmBoxComponent } from "./voicecall-confirm-box.component";

@NgModule({
    declarations: [VoicecallConfirmBoxComponent],
    exports: [VoicecallConfirmBoxComponent],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class VoicecallConfirmBoxModule{}