import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { InstructionsComponent } from "./instructions.component";
import { MatIconModule } from "@angular/material/icon";
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        MatIconModule,
        MatTooltipModule
    ],
    exports: [InstructionsComponent],
    declarations: [InstructionsComponent]
})
export class InstructionsModule {}