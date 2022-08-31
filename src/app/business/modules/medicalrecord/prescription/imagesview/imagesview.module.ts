import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ImagesviewComponent } from "./imagesview.component";
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatIconModule } from "@angular/material/icon";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        MatTooltipModule,
        MatIconModule
    ],
    exports: [ImagesviewComponent],
    declarations: [ImagesviewComponent]
})
export class ImagesViewModule {}