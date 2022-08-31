import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";;
import { ClinicalnotesComponent } from "./clinicalnotes.component";
import { ReactiveFormsModule } from "@angular/forms";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        NgbModule,
        FormsModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule,
        ReactiveFormsModule,
        MatTooltipModule
    ],
    exports: [ClinicalnotesComponent],
    declarations: [ClinicalnotesComponent]
})
export class ClinicalnotesModule { }