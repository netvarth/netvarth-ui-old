import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ForceDialogComponent } from "./force-dialog.component";

@NgModule({
    declarations: [ForceDialogComponent],
    exports: [ForceDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class ForceDialogModule{}