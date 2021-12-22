import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmBoxComponent } from "./confirm-box.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule
    ],
    declarations: [
        ConfirmBoxComponent
    ],
    exports: [
        ConfirmBoxComponent
    ]
})
export class ConfirmBoxModule{}