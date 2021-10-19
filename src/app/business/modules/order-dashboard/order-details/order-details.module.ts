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
import { OrderActionsModule } from "../order-actions/order-actions.module";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { Nl2BrPipeModule } from "nl2br-pipe";

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
        OrderActionsModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
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