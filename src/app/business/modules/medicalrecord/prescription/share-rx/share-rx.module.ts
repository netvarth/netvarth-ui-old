import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { AddProviderAddonsModule } from "../../../../../ynw_provider/components/add-provider-addons/add-provider-addons.module";
import { FormMessageDisplayModule } from "../../../../../shared/modules/form-message-display/form-message-display.module";
import { ShareRxComponent } from "./share-rx.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CommonModule } from "@angular/common";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        AddProviderAddonsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatOptionModule,
        FormsModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule
    ],
    exports: [ShareRxComponent],
    declarations: [ShareRxComponent]
})
export class ShareRxModule {}