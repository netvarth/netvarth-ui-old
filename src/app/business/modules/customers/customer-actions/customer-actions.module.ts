import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { LastVisitModule } from "../../medicalrecord/last-visit/last-visit.module";
import { VoiceConfirmModule } from "../voice-confirm/voice-confirm.module";
import { CustomerActionsComponent } from "./customer-actions.component";
import { CommunicationService } from "../../../../business/services/communication-service";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        MatCheckboxModule,
        LoadingSpinnerModule,
        LastVisitModule,
        VoiceConfirmModule,
        CapitalizeFirstPipeModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule
    ],
    exports: [CustomerActionsComponent],
    declarations: [CustomerActionsComponent],
    providers:[
        CommunicationService
    ]
})
export class CustomerActionsModule {}