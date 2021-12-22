import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ConfirmBoxModule } from "../../../../../../shared/components/confirm-box/confirm-box.module";
import { CreateItemPopupComponent } from "./createitempopup.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";

@NgModule({
    declarations: [CreateItemPopupComponent],
    exports: [CreateItemPopupComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ConfirmBoxModule,
        MatRadioModule,
        MatDatepickerModule,
        MatInputModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatDialogModule,
        FormMessageDisplayModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    ]
})
export class CreateItemPopupModule{}