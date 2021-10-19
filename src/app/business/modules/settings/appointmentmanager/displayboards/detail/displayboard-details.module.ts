import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
import { GlobalSettingsModule } from "../global-settings/global-settings.module";
import { DisplayboardQSetDetailModule } from "../q-set/detail/displayboard-qset-detail.module";
import { DisplayboardQSetModule } from "../q-set/displayboard-qset.module";
import { DisplayboardDetailComponent } from "./displayboard-details.component";
const routes:  Routes = [
    {path: '', component: DisplayboardDetailComponent}
]
@NgModule({
    declarations: [DisplayboardDetailComponent],
    exports: [DisplayboardDetailComponent],
    imports: [
        CommonModule,
        FormMessageDisplayModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatSelectModule,
        MatOptionModule,
        DisplayboardQSetModule,
        DisplayboardQSetDetailModule,
        GlobalSettingsModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class DisplayboardDetailModule{}