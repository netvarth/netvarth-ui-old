import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { UserDetailReportComponent } from "./user-detail-report.component";
const routes: Routes = [
    {path: '', component: UserDetailReportComponent}
]
@NgModule({
    declarations: [UserDetailReportComponent],
    exports: [UserDetailReportComponent],
    imports: [
        CommonModule,
        MatTableModule,
        [RouterModule.forChild(routes)]
    ]
})
export class UserDetailReportModule{}