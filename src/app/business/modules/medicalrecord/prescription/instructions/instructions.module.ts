import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { InstructionsComponent } from "./instructions.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule
    ],
    exports: [InstructionsComponent],
    declarations: [InstructionsComponent]
})
export class InstructionsModule {}