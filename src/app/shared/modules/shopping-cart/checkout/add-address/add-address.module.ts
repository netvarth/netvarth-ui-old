import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { FormMessageDisplayModule } from "../../../form-message-display/form-message-display.module";
import { AddAddressComponent } from "./add-address.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        FormMessageDisplayModule
    ],
    exports: [AddAddressComponent],
    declarations : [ AddAddressComponent ]
})
export class AddAddressModule {}