import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { PreviewpdfComponent } from "./previewpdf.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule
    ],
    exports: [
        PreviewpdfComponent
    ],
    declarations: [
        PreviewpdfComponent
    ]
})
export class PreviewpdfModule {}
