import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
import { PaymentLinkComponent } from "./payment-link.component";

@NgModule({
    imports: [
        MatTooltipModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule
    ],
    exports: [
        PaymentLinkComponent
    ],
    declarations: [
        PaymentLinkComponent
    ]
})
export class PaymentLinkModule {}