import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AddItemNotesComponent } from "./add-item-notes.component";

@NgModule({
    declarations: [AddItemNotesComponent],
    exports: [AddItemNotesComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule
    ]
})
export class AddItemNotesModule{}