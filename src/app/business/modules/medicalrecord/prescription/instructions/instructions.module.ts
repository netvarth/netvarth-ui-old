import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { InstructionsComponent } from "./instructions.component";
import { MatIconModule } from "@angular/material/icon";
@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        MatIconModule
    ],
    exports: [InstructionsComponent],
    declarations: [InstructionsComponent]
})
export class InstructionsModule {}