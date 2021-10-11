import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { ServiceDetailComponent } from "./service-detail.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { Nl2BrPipeModule } from "nl2br-pipe";
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        FormMessageDisplayModule,
        Nl2BrPipeModule,
        CapitalizeFirstPipeModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    ],
    exports: [ServiceDetailComponent],
    declarations: [ServiceDetailComponent]
})
export class ServiceDetailModule {}