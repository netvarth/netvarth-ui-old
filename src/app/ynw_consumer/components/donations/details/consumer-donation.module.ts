import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { ServiceDetailModule } from "../../../../shared/components/service-detail/service-detail.module";
import { ConsumerDonationComponent } from "./consumer-donation.component";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { QuestionnaireModule } from "../../../../shared/components/questionnaire/questionnaire.module";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { MatRadioModule } from "@angular/material/radio";
import { PaymentModesModule } from "../../../../shared/modules/payment-modes/payment-modes.module";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
const routes: Routes = [
    {path: '', component: ConsumerDonationComponent}
]
@NgModule({
    declarations: [ConsumerDonationComponent],
    exports: [ConsumerDonationComponent],
    imports: [
        CommonModule,
        FormsModule,
        ServiceDetailModule,
        MatDialogModule,
        MatChipsModule,
        MatButtonModule,
        FormMessageDisplayModule,
        HeaderModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        QuestionnaireModule,
        MatRadioModule,
        PaymentModesModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        [RouterModule.forChild(routes)]
    ]
})
export class ConsumerDonationModule{}