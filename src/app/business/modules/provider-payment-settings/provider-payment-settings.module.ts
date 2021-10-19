import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { ProviderPaymentSettingsComponent } from "./provider-payment-settings.component";

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
        FormMessageDisplayModule
    ]
})
export class ProviderPaymentSettingsModule{}