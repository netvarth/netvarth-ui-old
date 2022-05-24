import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ShowuploadfileModule } from "../../../business/modules/medicalrecord/uploadfile/showuploadfile/showuploadfile.module";
import { FileService } from "../../services/file-service";
import { AttachmentPopupComponent } from "./attachment-popup.component";

@NgModule({
    imports: [
        MatDialogModule,
        ShowuploadfileModule,
        CommonModule
    ],
    exports: [
        AttachmentPopupComponent
    ],
    declarations: [
        AttachmentPopupComponent
    ],
    providers: [
        FileService
    ]
})
export class AttachmentPopupModule {}