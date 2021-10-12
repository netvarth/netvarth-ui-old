import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {  MatTableModule } from "@angular/material/table";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ActivityLogComponent } from "./activity-log.component";

@NgModule({
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        MatTableModule,
        MatDialogModule,
        CapitalizeFirstPipeModule
    ],
    exports: [ActivityLogComponent],
    declarations: [ActivityLogComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class ActivityLogModule {}