import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TelegramInfoModule } from "../../../../../../../../business/modules/settings/comm/telegram-info/telegram-info.module";
import { LoadingSpinnerModule } from "../../../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { AddProviderAddonsModule } from "../../../../../../../../ynw_provider/components/add-provider-addons/add-provider-addons.module";
import { UpdateProviderNotificationsComponent } from "./update-provider-notifications.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        TelegramInfoModule,
        AddProviderAddonsModule,
        MatSlideToggleModule,
        FormsModule,
        MatButtonModule,
        LoadingSpinnerModule
    ],
    exports: [UpdateProviderNotificationsComponent],
    declarations: [
        UpdateProviderNotificationsComponent
    ]
})
export class UpdateProviderNotificationsModule {}