import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { LastVisitComponent } from "./last-visit.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        MatTableModule,
        LoadingSpinnerModule
    ],
    exports: [LastVisitComponent],
    declarations: [LastVisitComponent]
})
export class LastVisitModule {}