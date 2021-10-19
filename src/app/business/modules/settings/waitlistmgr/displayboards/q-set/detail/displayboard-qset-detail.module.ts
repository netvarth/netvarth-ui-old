import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { LoadingSpinnerModule } from "../../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CapitalizeFirstPipeModule } from "../../../../../../../shared/pipes/capitalize.module";
import { DisplayboardQSetDetailComponent } from "./displayboard-qset-detail.component";
@NgModule({
    declarations: [DisplayboardQSetDetailComponent],
    exports: [DisplayboardQSetDetailComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        DragDropModule,
        NgxMatSelectSearchModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule
    ]
})
export class DisplayboardQSetDetailModule{}