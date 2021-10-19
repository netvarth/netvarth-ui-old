import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { UpgradeLicenseComponent } from "./upgrade-license.component";

@NgModule({
    declarations: [UpgradeLicenseComponent],
    exports: [UpgradeLicenseComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatGridListModule,
        MatButtonModule,
        LoadingSpinnerModule
    ]
})
export class UpgradeLicenseModule{}