import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule, Routes } from "@angular/router";
import { HeaderModule } from "../../modules/header/header.module";
import { CardModule } from "../card/card.module";
import { ProviderDetailComponent } from "./provider-detail.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { AddInboxMessagesModule } from "../add-inbox-messages/add-inbox-messages.module";
import { JDNDetailModule } from "../jdn-detail/jdn-detail.module";
import { CouponsModule } from "../coupons/coupons.module";
import { ServiceDetailModule } from "../service-detail/service-detail.module";
import { ConsumerJoinModule } from "../../../ynw_consumer/components/consumer-join/join.component.module";
import { ConfirmBoxModule } from "../confirm-box/confirm-box.module";
import { QRCodeGeneratordetailModule } from "../qrcodegenerator/qrcodegeneratordetail.module";
import { CheckavailabilityModule } from "../checkavailability/checkavaiablity.module";
// import { CheckavailabilityComponent } from "../checkavailability/checkavailability.component";

const routes: Routes = [
    { path: '', component: ProviderDetailComponent },
];
@NgModule({
    imports: [
        [RouterModule.forChild(routes)],
        CommonModule,
        MatDialogModule,
        HeaderModule,
        CardModule,
        MatTooltipModule,
        MatButtonModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        AddInboxMessagesModule,
        JDNDetailModule,
        CouponsModule,
        ServiceDetailModule,
        ConsumerJoinModule,
        ConfirmBoxModule,
        QRCodeGeneratordetailModule,
        CheckavailabilityModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    ],
    exports: [ ProviderDetailComponent ],
    declarations: [
        ProviderDetailComponent,
        // CheckavailabilityComponent
    
    ]
})
export class ProviderDetailModule {}