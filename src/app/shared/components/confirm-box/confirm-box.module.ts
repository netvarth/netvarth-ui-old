import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { ConfirmBoxComponent } from "./confirm-box.component";
import { AccordionModule } from "primeng/accordion";
import { MatChipsModule } from "@angular/material/chips";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        FormsModule,
        AccordionModule,
        MatChipsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormMessageDisplayModule,
        ReactiveFormsModule
    ],
    exports: [ConfirmBoxComponent],
    declarations: [
        ConfirmBoxComponent
    ]
})
export class ConfirmBoxModule {}