import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CustomerActionsComponent } from "./customer-actions.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        MatCheckboxModule,
        LoadingSpinnerModule
    ],
    exports: [CustomerActionsComponent],
    declarations: [CustomerActionsComponent]
})
export class CustomersActionsModule {}