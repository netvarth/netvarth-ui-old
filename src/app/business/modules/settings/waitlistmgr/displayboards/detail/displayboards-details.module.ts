import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { GlobalSettingsModule } from "../global-settings/global-settings.module";
import { DisplayboardQSetDetailModule } from "../q-set/detail/displayboard-qset-detail.module";
import { DisplayboardQSetModule } from "../q-set/displayboard-qset.module";
import { DisplayboardDetailComponent } from "./displayboard-details.component";
import { MatRadioButton } from '@angular/material/radio';
const routes: Routes = [
    {path: '', component: DisplayboardDetailComponent}
]
@NgModule({
    declarations: [DisplayboardDetailComponent],
    exports: [DisplayboardDetailComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatRadioButton,
        DisplayboardQSetModule,
        DisplayboardQSetDetailModule,
        CapitalizeFirstPipeModule,
        GlobalSettingsModule,
        [RouterModule.forChild(routes)]
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
})
export class DisplayboardDetailModule{}