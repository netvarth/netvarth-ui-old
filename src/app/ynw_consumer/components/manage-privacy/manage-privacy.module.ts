import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { ManagePrivacyComponent } from "./manage-privacy.component";

@NgModule({
    imports: [
        MatDialogModule,
        MatCheckboxModule,
        MatButtonModule,
        FormsModule,
        FormMessageDisplayModule
    ],
    exports: [
        ManagePrivacyComponent
    ],
    declarations: [
        ManagePrivacyComponent
    ]
})
export class ManagePrivacyModule { }