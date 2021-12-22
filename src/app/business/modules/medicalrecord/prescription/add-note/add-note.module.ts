import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormMessageDisplayModule } from "../../../../../shared/modules/form-message-display/form-message-display.module";
import { AddNoteComponent } from "./add-note.component";

@NgModule({
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        FormMessageDisplayModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule
    ],
    exports: [AddNoteComponent],
    declarations: [AddNoteComponent]
})
export class AddNoteModule {}