import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule, Routes } from "@angular/router";
import { SignaturePadModule } from "angular2-signaturepad";
import { ManualSignatureComponent } from "./manual-signature.component";
import { MatIconModule } from "@angular/material/icon";
const routes: Routes = [
    { path: '', component: ManualSignatureComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        SignaturePadModule,
        MatIconModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [ManualSignatureComponent],
    declarations: [ManualSignatureComponent]
})
export class ManualSignatureModule {}