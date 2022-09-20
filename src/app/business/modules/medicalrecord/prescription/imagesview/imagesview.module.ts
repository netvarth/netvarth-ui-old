import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ImagesviewComponent } from "./imagesview.component";
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatIconModule } from "@angular/material/icon";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        MatTooltipModule,
        MatIconModule,
        LoadingSpinnerModule,
    ],
    exports: [ImagesviewComponent],
    declarations: [ImagesviewComponent]
})
export class ImagesViewModule {}