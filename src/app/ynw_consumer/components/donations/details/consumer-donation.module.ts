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
import { ConsumerJoinModule } from "../../consumer-join/join.component.module";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { BookingAccountinfoModule } from "../../../../ynw_consumer/modules/booking-accountinfo/booking-accountinfo.module";
import { ServiceModule } from "../../../../shared/modules/service/service.module";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {  ReactiveFormsModule } from '@angular/forms';
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
        ConsumerJoinModule,
        BookingAccountinfoModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        ServiceModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,

        [RouterModule.forChild(routes)]
    ]
})
export class ConsumerDonationModule{}