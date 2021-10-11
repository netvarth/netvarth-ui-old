import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { VoicecallDetailsSendComponent } from "./voicecall-details-send.component";
@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        LoadingSpinnerModule,
        FormsModule
    ],
    exports: [VoicecallDetailsSendComponent],
    declarations: [
        VoicecallDetailsSendComponent
    ]
})
export class VoicecallDetailsSendModule {}