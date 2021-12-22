import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { TeamMembersModule } from "../../../../shared/modules/assign-team/team-members/team-members.module";
import { ConfirmBoxModule } from "../../../shared/confirm-box/confirm-box.module";
import { LocationUpdateComponent } from "./location-update.component";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {path:'', component: LocationUpdateComponent}
]
@NgModule({
    declarations: [LocationUpdateComponent],
    exports: [LocationUpdateComponent],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        ConfirmBoxModule,
        TeamMembersModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)]
    ]
})
export class LocationUpdateModule{}
