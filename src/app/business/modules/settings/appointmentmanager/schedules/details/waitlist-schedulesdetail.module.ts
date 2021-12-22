import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { WaitlistSchedulesDetailComponent } from "./waitlist-schedulesdetail.component";
import { CommonModule } from "@angular/common";
const routes: Routes = [
    { path: '', component: WaitlistSchedulesDetailComponent }
];
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
        FormMessageDisplayModule,
        NgbTimepickerModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [WaitlistSchedulesDetailComponent],
    declarations: [WaitlistSchedulesDetailComponent]
})
export class WaitlistSchedulesdetailModule {}