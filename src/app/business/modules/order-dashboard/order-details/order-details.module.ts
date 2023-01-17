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
import { RouterModule, Routes } from "@angular/router";
import { QuestionnaireModule } from "../../../../../../src/app/shared/components/questionnaire/questionnaire.module";
import { MatExpansionModule } from "@angular/material/expansion";
import { QuestionaireViewModule } from "../../../../shared/components/questionaire-view/questionaire-view.module";
import { MatButtonModule } from "@angular/material/button";
const routes: Routes = [
    {path: '', component: OrderDetailsComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatBadgeModule,
        MatButtonModule,
        MatTooltipModule,
        MatExpansionModule,
        LoadingSpinnerModule,
        CommunicationModule,
        CardModule,
        OrderActionsModule,
        QuestionnaireModule,
        QuestionaireViewModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        [RouterModule.forChild(routes)],
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