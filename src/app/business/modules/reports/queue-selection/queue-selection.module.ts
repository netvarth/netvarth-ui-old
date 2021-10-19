import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { QueueSelectionComponent } from "./queue-selection.component";

@NgModule({
    declarations: [QueueSelectionComponent],
    exports: [QueueSelectionComponent],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatCheckboxModule
    ]
})
export class QueueSelectionModule{}