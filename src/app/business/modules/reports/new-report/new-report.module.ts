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
import { NewReportComponent } from "./new-report.component";
import { RouterModule, Routes } from '@angular/router';
import { ExportBookingReportModule } from "../../export-booking-report/export-booking-report.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
const routes: Routes = [
    {path: '', component: NewReportComponent}
]
@NgModule({
    declarations: [NewReportComponent],
    exports: [NewReportComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatOptionModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatDatepickerModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        ExportBookingReportModule,
        MatCheckboxModule,
        [RouterModule.forChild(routes)]
    ]
})
export class NewReportModule{}