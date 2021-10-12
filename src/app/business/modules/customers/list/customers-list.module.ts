import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConfirmBoxModule } from "../../../../shared/components/confirm-box/confirm-box.module";
import { VoicecallDetailsSendModule } from "../../appointments/voicecall-details-send/voicecall-details-send.module";
import { CustomersActionsModule } from "../customer-actions/customer-actions.module";
import { CustomersListComponent } from "./customers-list.component";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LastVisitModule } from "../../medicalrecord/last-visit/last-visit.module";

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatCheckboxModule,
        CommonModule,
        VoicecallDetailsSendModule,
        CustomersActionsModule,
        ConfirmBoxModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        LastVisitModule
    ],
    exports: [CustomersListComponent],
    declarations: [CustomersListComponent]
})
export class CustomersListModule {}