import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UploadPrescriptionComponent } from "./upload-prescription.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { MatDialogModule } from "@angular/material/dialog";
import { ImagesViewModule } from "../imagesview/imagesview.module";
import { ShareRxModule } from "../share-rx/share-rx.module";
import { ConfirmBoxModule } from "../../../../../ynw_provider/shared/component/confirm-box/confirm-box.module";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
const routes: Routes = [
    { path: '', component: UploadPrescriptionComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        ImagesViewModule,
        ShareRxModule,
        ConfirmBoxModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)],
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    ],
    declarations: [UploadPrescriptionComponent],
    exports: [UploadPrescriptionComponent]
})
export class UploadPrescriptionModule {}