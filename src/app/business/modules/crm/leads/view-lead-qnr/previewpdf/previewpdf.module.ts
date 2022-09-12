import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { PreviewpdfComponent } from "./previewpdf.component";
import { MatIconModule } from "@angular/material/icon";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import {MatTooltipModule} from '@angular/material/tooltip';
import { PdfViewerModule } from 'ng2-pdf-viewer'; // <- import PdfViewerModule



@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        PdfViewerModule
    ],
    exports: [
        PreviewpdfComponent
    ],
    declarations: [
        PreviewpdfComponent
    ]
})
export class PreviewpdfModule {}
