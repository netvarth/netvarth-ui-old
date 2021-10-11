import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ListRecordingsModule } from "../../../../shared/components/list-recordings-dialog/list-recordings-dialog.module";
import { AppointmentActionsComponent } from "./appointment-actions.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        ListRecordingsModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatInputModule,
        MatChipsModule
    ],
    exports: [
        AppointmentActionsComponent
    ],
    declarations: [
        AppointmentActionsComponent
    ]
})
export class AppointmentActionsModule {}