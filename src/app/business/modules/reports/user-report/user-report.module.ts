import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { UserReportComponent } from "./user-report.component";
const routes: Routes = [
    {path: '', component: UserReportComponent}
]
@NgModule({
    declarations: [UserReportComponent],
    exports: [UserReportComponent],
    imports: [
        CommonModule,
        MatTableModule,
        [RouterModule.forChild(routes)]
    ]
})
export class UserReportModule{}