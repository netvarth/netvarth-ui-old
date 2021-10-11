import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GalleryModule } from "@ks89/angular-modal-gallery";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module"
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
import { BusinessPageComponent } from "./business-page.component";
import { BusinessPageRoutingModule } from "./business-page.routing.module";
import { CardModule } from "../card/card.module"
import { HeaderModule } from "../../../shared/modules/header/header.module"
import { AddInboxMessagesModule } from "../add-inbox-messages/add-inbox-messages.module";
import { JDNDetailModule } from "../jdn-detail/jdn-detail.module";
import { CouponsModule } from "../coupons/coupons.module";
import { ServiceDetailModule } from "../service-detail/service-detail.module";
@NgModule({
    imports: [
        CommonModule,
        BusinessPageRoutingModule,
        Nl2BrPipeModule,
        CapitalizeFirstPipeModule,
        MatTooltipModule,
        GalleryModule,
        LoadingSpinnerModule,
        CardModule,
        HeaderModule,
        AddInboxMessagesModule,
        JDNDetailModule,
        CouponsModule,
        ServiceDetailModule
    ],
    declarations: [
        BusinessPageComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    exports: [BusinessPageComponent]
})
export class BusinessPageModule {

}