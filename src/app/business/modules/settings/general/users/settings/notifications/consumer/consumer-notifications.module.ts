import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CapitalizeFirstPipeModule } from "../../../../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { AddProviderAddonsModule } from "../../../../../../../../ynw_provider/components/add-provider-addons/add-provider-addons.module";
import { ConsumerNotificationUserComponent } from "./consumer-notifications.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        AddProviderAddonsModule,
        LoadingSpinnerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatOptionModule,
        CapitalizeFirstPipeModule
    ],
    exports: [ConsumerNotificationUserComponent],
    declarations: [
        ConsumerNotificationUserComponent
    ]
})
export class ConsumerNotificationUserModule {}