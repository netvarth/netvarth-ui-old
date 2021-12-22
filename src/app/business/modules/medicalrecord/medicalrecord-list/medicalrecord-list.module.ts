import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { MedicalrecordListComponent } from "./medicalrecord-list.component";
const routes: Routes = [
    { path: '', component: MedicalrecordListComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatTableModule,
        MatProgressSpinnerModule,
        CapitalizeFirstPipeModule,
        ReactiveFormsModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [MedicalrecordListComponent],
    declarations: [MedicalrecordListComponent]
})
export class MedicalrecordListModule {}