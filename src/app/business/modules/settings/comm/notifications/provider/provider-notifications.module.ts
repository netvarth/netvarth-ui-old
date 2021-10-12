import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { AddProviderAddonsModule } from "../../../../../../ynw_provider/components/add-provider-addons/add-provider-addons.module";
import { UpdateProviderNotificationsModule } from "../../update-provider-notifications/update-provider-notifications.module";
import { ProviderNotificationsComponent } from "./provider-notifications.component";
const routes: Routes = [
    { path: '', component: ProviderNotificationsComponent }
];
@NgModule({
    imports: [
        CommonModule,
        AddProviderAddonsModule,
        UpdateProviderNotificationsModule,
        MatDialogModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [ProviderNotificationsComponent],
    declarations : [
        ProviderNotificationsComponent
    ]
})
export class ProviderNotificationsModule {}