import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { LastVisitComponent } from "./last-visit.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        MatTableModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule
    ],
    exports: [LastVisitComponent],
    declarations: [LastVisitComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class LastVisitModule {}