import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
import { OrderPaymentDetailsComponent } from "./order-payment-details.component";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes= [
    {path: '', component: OrderPaymentDetailsComponent}
]
@NgModule({
    declarations: [OrderPaymentDetailsComponent],
    exports: [OrderPaymentDetailsComponent],
    imports: [
        CommonModule,
        HeaderModule,
        MatTooltipModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class OrderPaymentDetailsModule{}