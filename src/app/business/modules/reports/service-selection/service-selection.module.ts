import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { ServiceSelectionComponent } from "./service-selection.component";

@NgModule({
    declarations: [ServiceSelectionComponent],
    exports: [ServiceSelectionComponent],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class ServiceSelectionModule{}