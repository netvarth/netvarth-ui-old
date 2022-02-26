import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { CapitalizeFirstPipeModule } from "../../../../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { AddProviderAddonsModule } from "../../../../../../../../business/modules/add-provider-addons/add-provider-addons.module";
import { RouterModule, Routes } from "@angular/router";
import { ProviderUserNotificationUserComponent } from "./provider-notifications.component";
import { UpdateProviderUserNotificationsModule } from "../update-provider-notifications/update-provider-notifications.module";
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
const routes: Routes = [
    {path: '',component:ProviderUserNotificationUserComponent }
]
@NgModule({
    imports: [
        CommonModule,
        AddProviderAddonsModule,
        UpdateProviderUserNotificationsModule,
        MatDialogModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        MatTabsModule,
        MatButtonToggleModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [ProviderUserNotificationUserComponent],
    declarations : [
        ProviderUserNotificationUserComponent
    ]
})
export class ProviderNotificationsUserModule {}