import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FileService } from "../../../../../../shared/services/file-service";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
import { AddcatalogimageComponent } from "./addcatalogimage.component";

@NgModule({
    declarations: [AddcatalogimageComponent],
    exports: [AddcatalogimageComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        FormMessageDisplayModule
    ],
    providers: [
        FileService
    ]
})
export class AddcatalogimageModule{}