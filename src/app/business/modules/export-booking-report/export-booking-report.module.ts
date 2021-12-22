import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { ExportReportService } from "../reports/export-report.service";
import { ExportBookingReportComponent } from "./export-booking-report.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        CapitalizeFirstPipeModule
    ],
    exports: [
        ExportBookingReportComponent
    ],
    declarations: [
        ExportBookingReportComponent
    ],
    providers: [
        ExportReportService
    ]
})
export class ExportBookingReportModule {}