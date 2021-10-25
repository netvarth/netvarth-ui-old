import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GalleryModule } from "@ks89/angular-modal-gallery";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module"
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
import { BusinessprovideruserPageComponent } from "./business-provideruser-page.component";
import { CardModule } from "../card/card.module"
import { HeaderModule } from "../../../shared/modules/header/header.module"
import { AddInboxMessagesModule } from "../add-inbox-messages/add-inbox-messages.module";
import { JDNDetailModule } from "../jdn-detail/jdn-detail.module";
import { CouponsModule } from "../coupons/coupons.module";
import { ServiceDetailModule } from "../service-detail/service-detail.module";
import { ConsumerJoinModule } from "../../../ynw_consumer/components/consumer-join/join.component.module";
import { ConfirmBoxModule } from "../confirm-box/confirm-box.module";
import { QRCodeGeneratordetailModule } from "../qrcodegenerator/qrcodegeneratordetail.module";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    { path: '', component: BusinessprovideruserPageComponent},
    { path: 'home', loadChildren: () => import('../business-page-home/business-page-home.module').then(m => m.BusinessPageHomeModule) },
    { path: ':userEncId', component: BusinessprovideruserPageComponent}
];
@NgModule({
    imports: [
        CommonModule,
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
        ServiceDetailModule,
        ConsumerJoinModule,
        ConfirmBoxModule,
        QRCodeGeneratordetailModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        BusinessprovideruserPageComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    exports: [BusinessprovideruserPageComponent]
})
export class BusinessprovideruserPageModule {

}