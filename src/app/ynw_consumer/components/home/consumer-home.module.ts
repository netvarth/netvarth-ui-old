import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { HeaderModule } from "../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConsumerHomeComponent } from "./consumer-home.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { WLCardModule } from "./wl-card/wl-card.module";
import { ApptCardModule } from "./appt-card/appt-card.module";
import { RouterModule, Routes } from "@angular/router";
import { GalleryModule } from "../../../shared/modules/gallery/gallery.module";
import { AddInboxMessagesModule } from "../../../shared/components/add-inbox-messages/add-inbox-messages.module";
import { RateServiceModule } from "../../../shared/components/consumer-rate-service-popup/rate-service-popup.module";
import { MeetingDetailsModule } from "../meeting-details/meeting-details.module";
import { ViewRxModule } from "./view-rx/view-rx.module";
import { NotificationListBoxModule } from "../../shared/component/notification-list-box/notification-list-box.module";
import { AttachmentPopupModule } from "../../../shared/components/attachment-popup/attachment-popup.module";
import { CouponsModule } from "../../../shared/components/coupons/coupons.module";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
const routes: Routes = [
    { path: '', component: ConsumerHomeComponent }
];
@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        MatDialogModule,
        MatGridListModule,
        MatTooltipModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        WLCardModule,
        ApptCardModule,
        GalleryModule,
        AddInboxMessagesModule,
        RateServiceModule,
        MeetingDetailsModule,
        ViewRxModule,
        NotificationListBoxModule,
        AttachmentPopupModule,
        CouponsModule,
        ScrollToModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        [RouterModule.forChild(routes)]
    ],
    exports: [ConsumerHomeComponent],
    declarations: [
        ConsumerHomeComponent
    ]
})
export class ConsumerHomeModule {}