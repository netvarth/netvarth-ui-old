import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { PreviewuploadedfilesComponent } from "./previewuploadedfiles.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule
    ],
    exports: [
        PreviewuploadedfilesComponent
    ],
    declarations: [
        PreviewuploadedfilesComponent
    ]
})
export class PreviewuploadedfilesModule {}