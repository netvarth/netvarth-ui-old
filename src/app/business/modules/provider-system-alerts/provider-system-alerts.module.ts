import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { PagerModule } from "../../../shared/modules/pager/pager.module";
import { ProviderSystemAlertComponent } from "./provider-system-alerts.component";
const routes: Routes = [
    { path: '', component: ProviderSystemAlertComponent }
];
@NgModule({
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatDatepickerModule,
        PagerModule,
        FormsModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        ProviderSystemAlertComponent
    ],
    exports: [
        ProviderSystemAlertComponent
    ]
})
export class ProviderSystemAlertsModule {}