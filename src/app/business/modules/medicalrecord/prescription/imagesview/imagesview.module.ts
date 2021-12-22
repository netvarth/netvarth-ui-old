import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ImagesviewComponent } from "./imagesview.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule
    ],
    exports: [ImagesviewComponent],
    declarations: [ImagesviewComponent]
})
export class ImagesViewModule {}