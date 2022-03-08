import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { UpdateProviderNotificationsModule } from "../../update-provider-notifications/update-provider-notifications.module";
import { ProviderNotificationsComponent } from "./provider-notifications.component";
import { AddProviderAddonsModule } from "../../../../../../business/modules/add-provider-addons/add-provider-addons.module";
import {MatTabsModule} from '@angular/material/tabs';
const routes: Routes = [
    { path: '', component: ProviderNotificationsComponent }
];
@NgModule({
    imports: [
        CommonModule,
        AddProviderAddonsModule,
        UpdateProviderNotificationsModule,
        MatDialogModule,
        MatTabsModule,
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