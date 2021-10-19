import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { ServiceListDialogComponent } from "./service-list-dialog.component";

@NgModule({
    declarations: [ServiceListDialogComponent],
    exports: [ServiceListDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatListModule,
        MatButtonModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
    ]
})
export class ServiceListDialogModule{}