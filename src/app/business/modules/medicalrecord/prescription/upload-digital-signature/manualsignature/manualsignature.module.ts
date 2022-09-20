import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule, Routes } from "@angular/router";
import { SignaturePadModule } from "angular2-signaturepad";
import { ManualSignatureComponent } from "./manual-signature.component";
import { MatIconModule } from "@angular/material/icon";
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

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
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [ManualSignatureComponent],
    declarations: [ManualSignatureComponent]
})
export class ManualSignatureModule {}