import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule, Routes } from "@angular/router";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { AdjustscheduleDelayComponent } from "./adjust-schedule-delay.component";
const routes: Routes = [
    {path: '', component: AdjustscheduleDelayComponent}
]
@NgModule({
    declarations: [AdjustscheduleDelayComponent],
    exports: [AdjustscheduleDelayComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatButtonModule,
        ReactiveFormsModule,
        NgbTimepickerModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        [RouterModule.forChild(routes)]
    ]
})
export class AdjustScheduleDelayModule{}