import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { RouterModule, Routes } from "@angular/router";
import { RazorpayService } from "../../../../../shared/services/razorpay.service";
import { FormMessageDisplayModule } from "../../../../../shared/modules/form-message-display/form-message-display.module";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../modules/loading-spinner/loading-spinner.module";
import { PaymentModesModule } from "../../../../modules/payment-modes/payment-modes.module";
import { CapitalizeFirstPipeModule } from "../../../../pipes/capitalize.module";
import { QuestionnaireModule } from "../../../questionnaire/questionnaire.module";
import { ServiceDetailModule } from "../../../service-detail/service-detail.module";
import { DonationLinkComponent } from "./donation-link.component";
import { PaytmService } from "../../../../../shared/services/paytm.service";
const routes: Routes = [
    {path: '', component: DonationLinkComponent}
]
@NgModule({
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
        [RouterModule.forChild(routes)]
    ],
    exports: [
        DonationLinkComponent
    ],
    declarations: [
        DonationLinkComponent
    ],
    providers: [RazorpayService, PaytmService]
})
export class DonationLinkModule {}