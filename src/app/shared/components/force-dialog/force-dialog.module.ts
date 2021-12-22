import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ForceDialogComponent } from "./force-dialog.component";

@NgModule({
    declarations: [ForceDialogComponent],
    exports: [ForceDialogComponent],
    imports: [
        CommonModule
    ]
})
export class ForceDialogModule{}