import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { FormMessageDisplayModule } from "../../../../../shared/modules/form-message-display/form-message-display.module";
import { AddressComponent } from "./address.component";

@NgModule({
    declarations: [AddressComponent],
    exports: [AddressComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        MatButtonModule
    ]
})
export class AddressModule{}