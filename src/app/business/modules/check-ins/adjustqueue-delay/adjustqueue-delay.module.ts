import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule, Routes } from "@angular/router";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { AdjustqueueDelayComponent } from "./adjustqueue-delay.component";
import { AddProviderAddonsModule } from "../../add-provider-addons/add-provider-addons.module";
const routes: Routes = [
    {path: '',component: AdjustqueueDelayComponent}
]
@NgModule({
    declarations: [AdjustqueueDelayComponent],
    exports: [AdjustqueueDelayComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        AddProviderAddonsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatCheckboxModule,
        NgbTimepickerModule,
        FormMessageDisplayModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)]
    ]
})
export class AdjustqueueDelayModule{}
