import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GalleryModule } from "@ks89/angular-modal-gallery";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module"
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
import { BusinessprovideruserPageComponent } from "./business-provideruser-page.component";
import { BusinessprovideruserPageRoutingModule } from "./business-provideruser-page.routing.module";
import { CardModule } from "../card/card.module"
import { HeaderModule } from "../../../shared/modules/header/header.module"
import { CheckavailabilityComponent } from "../checkavailability/checkavailability.component";
@NgModule({
    imports: [
        CommonModule,
        BusinessprovideruserPageRoutingModule,
        Nl2BrPipeModule,
        CapitalizeFirstPipeModule,
        MatTooltipModule,
        GalleryModule,
        LoadingSpinnerModule,
        CardModule,
        HeaderModule
    ],
    declarations: [
        BusinessprovideruserPageComponent,
        CheckavailabilityComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    exports: [BusinessprovideruserPageComponent]
})
export class BusinessprovideruserPageModule {

}