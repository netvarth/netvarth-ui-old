import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { QuestionnaireModule } from "../../../../shared/components/questionnaire/questionnaire.module";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
import { ConsumerPaymentDetailsComponent } from "./payment-details.component";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
const routes: Routes = [
    { path: '', component: ConsumerPaymentDetailsComponent },
];
@NgModule({
    imports: [
        [RouterModule.forChild(routes)],
        HeaderModule,
        CommonModule,
        QuestionnaireModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule
    ],
    exports: [ConsumerPaymentDetailsComponent],
    declarations: [
        ConsumerPaymentDetailsComponent
    ]
})
export class PaymentDetailsModule {}