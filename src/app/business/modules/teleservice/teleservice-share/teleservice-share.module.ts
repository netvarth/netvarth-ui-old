import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { AddProviderAddonsModule } from "../../add-provider-addons/add-provider-addons.module";
import { TeleServiceShareComponent } from "./teleservice-share.component";

@NgModule({
    declarations: [TeleServiceShareComponent],
    exports: [TeleServiceShareComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatTabsModule,
        MatDialogModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatInputModule,
        FormMessageDisplayModule,
        AddProviderAddonsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class TeleServiceShareModule{}