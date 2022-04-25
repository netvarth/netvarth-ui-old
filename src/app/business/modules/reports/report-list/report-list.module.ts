import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { RouterModule, Routes } from '@angular/router';
import { ExportBookingReportModule } from "../../export-booking-report/export-booking-report.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { PagerModule } from "../../../../../../src/app/shared/modules/pager/pager.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ReportListComponent } from "./report-list.component";
import { NgxPaginationModule } from "ngx-pagination";
const routes: Routes = [
    {path: '', component: ReportListComponent}
]
@NgModule({
    declarations: [ReportListComponent],
    exports: [ReportListComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatOptionModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        PagerModule,
        MatTooltipModule,
        MatDatepickerModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        ExportBookingReportModule,
        MatCheckboxModule,
        NgxPaginationModule,
        [RouterModule.forChild(routes)]
    ]
})
export class ReportListModule{}