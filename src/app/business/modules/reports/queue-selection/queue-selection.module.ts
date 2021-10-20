import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { QueueSelectionComponent } from "./queue-selection.component";
const routes: Routes = [
    {path: '', component: QueueSelectionComponent}
]
@NgModule({
    declarations: [QueueSelectionComponent],
    exports: [QueueSelectionComponent],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatCheckboxModule,
        [RouterModule.forChild(routes)]
    ]
})
export class QueueSelectionModule{}