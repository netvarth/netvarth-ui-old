import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { LoadingSpinnerModule } from "../../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { FormMessageDisplayModule } from "../../../../../../../shared/modules/form-message-display/form-message-display.module";
import { DisplayboardQSetDetailComponent } from "./displayboard-qset-detail.component";
import { CapitalizeFirstPipeModule } from "../../../../../../../shared/pipes/capitalize.module";
import { MatRadioModule } from "@angular/material/radio";

@NgModule({
    declarations: [DisplayboardQSetDetailComponent],
    exports: [DisplayboardQSetDetailComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatButtonModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatOptionModule,
        MatCheckboxModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule
    ]
})
export class DisplayboardQSetDetailModule{}