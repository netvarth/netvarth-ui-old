import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ItemDetailsComponent } from "./item-details.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { MatRadioModule } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ConfirmBoxModule } from "../../../../../../shared/components/confirm-box/confirm-box.module";
const routes: Routes = [
    { path: '', component: ItemDetailsComponent }
]
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatRadioModule,
        MatDatepickerModule,
        MatInputModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        ConfirmBoxModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        [RouterModule.forChild(routes)]
    ],
    exports: [ItemDetailsComponent],
    declarations: [
        ItemDetailsComponent
    ]
})
export class ItemDetailsModule {}