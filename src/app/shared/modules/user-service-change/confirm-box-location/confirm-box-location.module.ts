import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmBoxLocationComponent } from "./confirm-box-location.component";

@NgModule({
    declarations: [ConfirmBoxLocationComponent],
    exports: [ConfirmBoxLocationComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        FormsModule
    ]
})
export class ConfirmBoxLocationModule{}