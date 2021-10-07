import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProviderSystemAlertComponent } from "./provider-system-alerts.component";

const routes: Routes = [
    { path: '', component: ProviderSystemAlertComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProviderSystemAlertsRoutingModule{}