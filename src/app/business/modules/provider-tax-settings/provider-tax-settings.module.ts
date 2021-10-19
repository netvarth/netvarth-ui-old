import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ProvidertaxSettingsComponent } from "./provider-tax-settings.component";

@NgModule({
    declarations: [ProvidertaxSettingsComponent],
    exports: [ProvidertaxSettingsComponent],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule
    ]
})
export class ProvidertaxSettingsModule{}