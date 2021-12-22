import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { RouterModule, Routes } from "@angular/router";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { ProvidertaxSettingsComponent } from "./provider-tax-settings.component";
const routes: Routes = [
    {path:'', component: ProvidertaxSettingsComponent}
]
@NgModule({
    declarations: [ProvidertaxSettingsComponent],
    exports: [ProvidertaxSettingsComponent],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        FormsModule,
        FormMessageDisplayModule,

        [RouterModule.forChild(routes)]
    ]
})
export class ProvidertaxSettingsModule{}