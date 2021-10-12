import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule, Routes } from "@angular/router";
import { SignaturePadModule } from "angular2-signaturepad";
import { ConfirmBoxModule } from "../../../../../../ynw_provider/shared/component/confirm-box/confirm-box.module";
import { UploadSignatureComponent } from "./upload-signature.component";
const routes: Routes = [
    { path: '', component: UploadSignatureComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        SignaturePadModule,
        ConfirmBoxModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [UploadSignatureComponent],
    declarations: [UploadSignatureComponent]
})
export class UploadSignatureModule {}