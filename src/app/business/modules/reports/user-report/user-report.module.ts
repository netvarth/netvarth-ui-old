import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { UserReportComponent } from "./user-report.component";

@NgModule({
    declarations: [UserReportComponent],
    exports: [UserReportComponent],
    imports: [
        CommonModule,
        MatTableModule
    ]
})
export class UserReportModule{}