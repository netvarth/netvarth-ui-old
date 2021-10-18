import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
import { CheckYourStatusComponent } from "./check-status.component";
import { CheckStatusRoutingModule } from "./check-status.routing.module";

@NgModule({
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        CheckStatusRoutingModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        CheckYourStatusComponent
    ]
})
export class CheckStatusModule {}