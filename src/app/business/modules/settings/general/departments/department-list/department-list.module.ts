import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { DepartmentListComponent } from "./department-list.component";
import { RouterModule, Routes } from "@angular/router";
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
const routes: Routes = [
    {path:'', component: DepartmentListComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatTooltipModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        TableModule,
        ButtonModule,
        [RouterModule.forChild(routes)]
    ],
    exports : [DepartmentListComponent],
    declarations: [DepartmentListComponent]
})
export class DepartmentListModule {}