import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { ProviderPaymentSettingsComponent } from "./provider-payment-settings.component";
const routes: Routes = [
    {path:'', component: ProviderPaymentSettingsComponent}
]
@NgModule({
    declarations: [ProviderPaymentSettingsComponent],
    exports: [ProviderPaymentSettingsComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatRadioModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        [RouterModule.forChild(routes)]
    ]
})
export class ProviderPaymentSettingsModule{}