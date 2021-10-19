import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { UserDetailReportComponent } from "./user-detail-report.component";

@NgModule({
    declarations: [UserDetailReportComponent],
    exports: [UserDetailReportComponent],
    imports: [
        CommonModule,
        MatTableModule
    ]
})
export class UserDetailReportModule{}