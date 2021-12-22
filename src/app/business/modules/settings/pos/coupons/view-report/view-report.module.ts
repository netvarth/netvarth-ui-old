import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewReportComponent } from "./view-report.component";
const routes: Routes = [
    {path: '', component: ViewReportComponent}
]
@NgModule({
    declarations: [ViewReportComponent],
    exports: [ViewReportComponent],
    imports: [
        CommonModule,
        [RouterModule.forChild(routes)]
    ]
})
export class ViewReportModule{}