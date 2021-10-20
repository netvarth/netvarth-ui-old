import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { CriteriaDialogModule } from "./criteria-dialog/criteria-dialog.module";
import { GeneratedReportComponent } from "./generated-report.component";
const routes: Routes = [
    {path: '', component: GeneratedReportComponent}
]
@NgModule({
    declarations: [GeneratedReportComponent],
    exports: [GeneratedReportComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatListModule,
        MatSelectModule,
        MatOptionModule,
        FormsModule,
        MatTableModule,
        MatSortModule,
        CriteriaDialogModule,
        [RouterModule.forChild(routes)]
    ]
})
export class GeneratedReportModule{}