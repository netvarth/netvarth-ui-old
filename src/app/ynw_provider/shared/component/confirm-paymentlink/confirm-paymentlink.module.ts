import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { AddProviderAddonsModule } from "../../../../ynw_provider/components/add-provider-addons/add-provider-addons.module";
import { ConfirmPaymentLinkComponent } from "./confirm-paymentlink.component";
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormMessageDisplayModule,
        AddProviderAddonsModule
    ],
    exports: [ConfirmPaymentLinkComponent],
    declarations: [ConfirmPaymentLinkComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class ConfirmPaymentLinkModule {}