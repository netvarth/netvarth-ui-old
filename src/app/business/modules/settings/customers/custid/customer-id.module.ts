import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { CustomerIdSettingsComponent } from "./customer-id.component";
const routes: Routes = [
    {path: '', component: CustomerIdSettingsComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [CustomerIdSettingsComponent],
    declarations: [CustomerIdSettingsComponent]
})
export class CustomerIdSettingsModule {}