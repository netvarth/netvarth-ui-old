import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { ProviderWaitlistCheckInCancelPopupComponent } from "./provider-waitlist-checkin-cancel-popup.component";
import { ProviderSharedFuctions } from "../../../../business/functions/provider-shared-functions";

@NgModule({
    declarations: [ProviderWaitlistCheckInCancelPopupComponent],
    exports: [ProviderWaitlistCheckInCancelPopupComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        MatChipsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        CapitalizeFirstPipeModule
    ],
    providers:[
        ProviderSharedFuctions
    ]
})
export class ProviderWaitlistCheckInCancelModule{}
