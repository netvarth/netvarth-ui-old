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
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConsumerNotificationsComponent } from "./consumer-notifications.component";
import { AddProviderAddonsModule } from "../../../../../../business/modules/add-provider-addons/add-provider-addons.module";
import { MatTabsModule } from "@angular/material/tabs";
const routes: Routes = [
    { path: '', component: ConsumerNotificationsComponent }
];
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
        MatTabsModule,
        MatSelectModule,
        MatOptionModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [ConsumerNotificationsComponent],
    declarations: [ConsumerNotificationsComponent]
})
export class ConsumerNotificationsModule {}