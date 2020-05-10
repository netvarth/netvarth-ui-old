import { NgModule } from '@angular/core';
import { ConsumerPaymentsComponent } from './payments.component';
import { ConsumerPaymentsRoutingModule } from './payments.routing.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
@NgModule({
    declarations: [
        ConsumerPaymentsComponent
    ],
    imports: [
        ConsumerPaymentsRoutingModule,
        BreadCrumbModule,
        CommonModule,
        SharedModule,
        CapitalizeFirstPipeModule
    ],
    exports: [
        ConsumerPaymentsComponent
    ]
})
export class ConsumerPaymentsModule { }
