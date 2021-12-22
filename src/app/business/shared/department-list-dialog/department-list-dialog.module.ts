import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { DepartmentListDialogComponent } from "./department-list-dialog.component";

@NgModule({
    declarations: [DepartmentListDialogComponent],
    exports: [DepartmentListDialogComponent],
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        MatListModule,
        MatDialogModule,
        MatButtonModule,
        FormsModule
    ]
})
export class DepartmentListDialogModule{}