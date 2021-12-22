import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { FormMessageDisplayModule } from "../../../../../shared/modules/form-message-display/form-message-display.module";
import { AddDrugComponent } from "./add-drug.component";

@NgModule({
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        CommonModule,
        FormMessageDisplayModule,
        MatButtonModule,
        CapitalizeFirstPipeModule
    ],
    exports: [AddDrugComponent],
    declarations: [AddDrugComponent]
})
export class AddDrugModule {}