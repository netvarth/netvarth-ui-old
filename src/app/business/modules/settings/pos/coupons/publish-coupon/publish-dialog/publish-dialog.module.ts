import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { ConfirmBoxModule } from "../../../../../../../shared/components/confirm-box/confirm-box.module";
import { FormMessageDisplayModule } from "../../../../../../../shared/modules/form-message-display/form-message-display.module";
import { PublishDialogComponent } from "./publish-dialog.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatDatepickerModule,
        MatInputModule,
        MatButtonModule,
        FormMessageDisplayModule,
        ConfirmBoxModule
    ],
    exports: [PublishDialogComponent],
    declarations: [PublishDialogComponent]
})
export class PublishDialogModule{}