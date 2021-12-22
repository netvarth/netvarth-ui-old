import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { DepartmentDetailComponent } from "./department.details.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DepartmentModule } from "../../../../department/department.module";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {path:'', component: DepartmentDetailComponent}
]
@NgModule({
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        CapitalizeFirstPipeModule,
        ReactiveFormsModule,
        DepartmentModule,
        [RouterModule.forChild(routes)]
    ],
    exports : [DepartmentDetailComponent],
    declarations: [DepartmentDetailComponent]
})
export class DepartmentDetailsModule {}