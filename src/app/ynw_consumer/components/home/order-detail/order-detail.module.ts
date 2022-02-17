import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { OrderDetailComponent } from "./order-detail.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { Nl2BrPipeModule } from "nl2br-pipe";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { ActionPopupModule } from "../action-popup/action-popup.module";
import { CommunicationModule } from "../../../../shared/components/communication/communication.module";
import { GalleryModule } from "../../../../shared/modules/gallery/gallery.module";
import { QuestionnaireModule } from "../../../../../../src/app/shared/components/questionnaire/questionnaire.module";

const routes: Routes = [
    { path: '', component: OrderDetailComponent }
];
@NgModule({
    imports:[
        [RouterModule.forChild(routes)],
        CommonModule,
        HeaderModule,
        MatButtonToggleModule,
        MatTooltipModule,
        MatIconModule,
        MatGridListModule,
        LoadingSpinnerModule,
        NgxQRCodeModule,
        Nl2BrPipeModule,
        CapitalizeFirstPipeModule,
        ActionPopupModule,
        CommunicationModule,
        QuestionnaireModule,
        GalleryModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    ],
    declarations: [
        OrderDetailComponent
    ],
    exports: [
        OrderDetailComponent
    ]
    
})
export class OrderDetailModule {}