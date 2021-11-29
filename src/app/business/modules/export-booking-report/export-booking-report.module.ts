import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ExportReportService } from "../reports/export-report.service";
import { ExportBookingReportComponent } from "./export-booking-report.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule
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