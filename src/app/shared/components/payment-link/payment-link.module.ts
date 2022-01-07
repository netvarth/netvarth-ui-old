import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { PaymentModesModule } from "../../modules/payment-modes/payment-modes.module";
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
import { PaymentLinkComponent } from "./payment-link.component";
const routes: Routes = [
    {path: '', component: PaymentLinkComponent}
]
@NgModule({
    imports: [
        MatTooltipModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule,
        MatRadioModule,
        PaymentModesModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        PaymentLinkComponent
    ],
    declarations: [
        PaymentLinkComponent
    ]
})
export class PaymentLinkModule {}