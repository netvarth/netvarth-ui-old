import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { FileService } from "../../../../shared/services/file-service";
import { FormMessageDisplayModule } from "../../form-message-display/form-message-display.module";
import { GalleryImportComponent } from "./gallery-import.component";

@NgModule({
    declarations: [GalleryImportComponent],
    exports: [GalleryImportComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatMenuModule,
        MatIconModule,
        FormMessageDisplayModule
    ],
    providers: [
        FileService
    ]
})
export class GalleryImportModule {}