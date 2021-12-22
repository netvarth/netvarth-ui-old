import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ListRecordingsDialogComponent } from "./list-recordings-dialog.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule
    ],
    exports: [
        ListRecordingsDialogComponent
    ],
    declarations: [
        ListRecordingsDialogComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class ListRecordingsModule {}