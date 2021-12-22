import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { ServiceSelectionComponent } from "./service-selection.component";
const routes: Routes = [
    {path: '', component: ServiceSelectionComponent}
]
@NgModule({
    declarations: [ServiceSelectionComponent],
    exports: [ServiceSelectionComponent],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        [RouterModule.forChild(routes)]
    ]
})
export class ServiceSelectionModule{}