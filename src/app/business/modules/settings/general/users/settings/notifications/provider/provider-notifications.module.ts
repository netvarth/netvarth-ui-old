import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { CapitalizeFirstPipeModule } from "../../../../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { AddProviderAddonsModule } from "../../../../../../../../ynw_provider/components/add-provider-addons/add-provider-addons.module";
import { UpdateProviderNotificationsModule } from "../update-provider-notifications/update-provider-notifications.module";
import { ProviderNotificationUserComponent } from "./provider-notifications.component";

@NgModule({
    imports: [
        CommonModule,
        AddProviderAddonsModule,
        UpdateProviderNotificationsModule,
        MatDialogModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule
    ],
    exports: [ProviderNotificationUserComponent],
    declarations : [
        ProviderNotificationUserComponent
    ]
})
export class ProviderNotificationsUserModule {}