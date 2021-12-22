import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from ".././../../../shared/pipes/capitalize.module";
import { CustomerSelectionComponent } from "./customer-selection.component";
const routes: Routes = [
    {path: '', component: CustomerSelectionComponent}
]
@NgModule({
    declarations: [CustomerSelectionComponent],
    exports: [CustomerSelectionComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatRadioModule,
        MatInputModule,
        CapitalizeFirstPipeModule,
        MatCheckboxModule,
        [RouterModule.forChild(routes)]
    ]
})
export class CustomerSelectionModule{}