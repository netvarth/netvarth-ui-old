import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
import { PaymentLinkComponent } from "./payment-link.component";
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import { PaymentLinkRoutingModule } from "./payment-link.routing.module";


  @NgModule({
    declarations: [
        PaymentLinkComponent
    ],
    imports: [
        CommonModule,
        // RouterModule.forChild(routes),
        CapitalizeFirstPipeModule,
        MatTooltipModule,
        PaymentLinkRoutingModule


    ],
    exports: [
        PaymentLinkComponent
    ],
})
export class PaymentLinkModule {

}