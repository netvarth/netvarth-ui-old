import { NgModule } from '@angular/core';
import { ConsumerPaymentsComponent } from './payments.component';
import { ConsumerPaymentsRoutingModule } from './payments.routing.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { ConsumerPaymentDetailsComponent } from './payment-details/payment-details.component';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
@NgModule({
    declarations: [
        ConsumerPaymentsComponent,
        ConsumerPaymentDetailsComponent
    ],
    imports: [
        ConsumerPaymentsRoutingModule,
        BreadCrumbModule,
        CommonModule,
        SharedModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule
    ],
    exports: [
        ConsumerPaymentsComponent
    ]
})
export class ConsumerPaymentsModule { }
