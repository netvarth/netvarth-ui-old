import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { PreviewpdfComponent } from "./previewpdf.component";
import { MatIconModule } from "@angular/material/icon";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";


@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        LoadingSpinnerModule
    ],
    exports: [
        PreviewpdfComponent
    ],
    declarations: [
        PreviewpdfComponent
    ]
})
export class PreviewpdfModule {}
