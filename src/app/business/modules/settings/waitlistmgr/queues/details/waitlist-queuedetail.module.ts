import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { WaitlistQueueDetailComponent } from "./waitlist-queuedetail.component";
const routes: Routes = [
    { path: '', component: WaitlistQueueDetailComponent },
];
@NgModule({
    declarations: [WaitlistQueueDetailComponent],
    exports: [WaitlistQueueDetailComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        NgbTimepickerModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class WaitlistQueueDetailModule{}