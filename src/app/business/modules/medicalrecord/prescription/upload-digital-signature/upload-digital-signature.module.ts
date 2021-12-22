import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConfirmBoxModule } from "../../../../shared/confirm-box/confirm-box.module";
import { ImagesViewModule } from "../imagesview/imagesview.module";
import { UploadDigitalSignatureComponent } from "./upload-digital-signature.component";
const routes: Routes = [
    { path: '', component: UploadDigitalSignatureComponent}
]
@NgModule({
    declarations: [UploadDigitalSignatureComponent],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        CommonModule,
        ImagesViewModule,
        ConfirmBoxModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [UploadDigitalSignatureComponent]
})
export class UploadDigitalSignatureModule{}