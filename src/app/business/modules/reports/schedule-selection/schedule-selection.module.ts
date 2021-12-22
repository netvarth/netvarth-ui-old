import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { ScheduleSelectionComponent } from "./schedule-selection.component";
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {path: '', component: ScheduleSelectionComponent}
]
@NgModule({
    declarations: [ScheduleSelectionComponent],
    exports: [ScheduleSelectionComponent],
    imports: [
        CommonModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        [RouterModule.forChild(routes)]
    ]
})
export class ScheduleSelectionModule{}