import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
import { ConfirmBoxModule } from "../../../../../../shared/components/confirm-box/confirm-box.module";
import { ItemDetailsComponent } from "./item-details.component";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonModule } from "@angular/material/button";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
const routes: Routes = [
    { path: '', component: ItemDetailsComponent }
];
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatRadioModule,
        MatCheckboxModule,
        MatMenuModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        ConfirmBoxModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)],
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    ],
    exports: [ItemDetailsComponent],
    declarations: [
        ItemDetailsComponent
    ]
})
export class ItemDetailsModule {}