import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { AddInboxMessagesComponent } from "./add-inbox-messages.component";

@NgModule({
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        FormsModule,
        CommonModule
    ],
    exports: [AddInboxMessagesComponent],
    declarations: [
        AddInboxMessagesComponent
    ]
})
export class AddInboxMessagesModule {}