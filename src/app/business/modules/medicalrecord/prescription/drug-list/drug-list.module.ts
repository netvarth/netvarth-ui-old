import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConfirmBoxModule } from "../../../../../ynw_provider/shared/component/confirm-box/confirm-box.module";
import { AddDrugModule } from "../add-drug/add-drug.module";
import { InstructionsModule } from "../instructions/instructions.module";
import { ShareRxModule } from "../share-rx/share-rx.module";
import { DrugListComponent } from "./drug-list.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        AddDrugModule,
        InstructionsModule,
        ShareRxModule,
        ConfirmBoxModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        FormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule
    ],
    exports: [DrugListComponent],
    declarations: [DrugListComponent]
})
export class DrugListModule {}