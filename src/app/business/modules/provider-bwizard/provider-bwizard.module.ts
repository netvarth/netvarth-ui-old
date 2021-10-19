import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { ProviderbWizardComponent } from "./provider-bwizard.component";
import { DynamicFormModule } from "../../../shared/modules/dynamic-form/dynamic-form.module";
import { AddProviderSchedulesModule } from "../../../business/modules/add-provider-schedule/add-provider-schedule.module";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { ProviderStartTourModule } from "../provider-start-tour/provider-start-tour.module";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatIconModule,
        MatCheckboxModule,
        MatMenuModule,
        MatButtonModule,
        MatRadioModule,
        FormMessageDisplayModule,
        NgbTimepickerModule,
        LoadingSpinnerModule,
        DynamicFormModule,
        AddProviderSchedulesModule,
        CapitalizeFirstPipeModule,
        ProviderStartTourModule
    ],
    exports: [ProviderbWizardComponent],
    declarations: [
        ProviderbWizardComponent
    ]
})
export class ProviderBwizardModule {}