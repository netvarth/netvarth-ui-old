import { NgModule } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { OrderDetailsComponent } from "./order-details.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CommonModule } from "@angular/common";
import { CommunicationModule } from "../../../../shared/components/communication/communication.module";
import { CardModule } from "../../../../shared/components/card/card.module";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatBadgeModule,
        MatTooltipModule,
        LoadingSpinnerModule,
        CommunicationModule,
        CardModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    ],
    exports: [
        OrderDetailsComponent
    ],
    declarations: [
        OrderDetailsComponent
    ]
})
export class OrderDetailsModule {}