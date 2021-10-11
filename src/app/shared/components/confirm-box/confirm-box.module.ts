import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { ConfirmBoxComponent } from "./confirm-box.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        FormsModule,
        FormMessageDisplayModule
    ],
    exports: [ConfirmBoxComponent],
    declarations: [
        ConfirmBoxComponent
    ]
})
export class ConfirmBoxModule {}