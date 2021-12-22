import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { TeleServiceConfirmBoxComponent } from "./teleservice-confirm-box.component";

@NgModule({
    declarations: [TeleServiceConfirmBoxComponent],
    exports: [TeleServiceConfirmBoxComponent],
    imports: [
        MatDialogModule,
        CommonModule
    ]
})
export class TeleServiceConfirmBoxModule{}