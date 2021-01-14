import { NgModule } from '@angular/core';

import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';

import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { ConsumerOrderRoutingModule } from './order.routing.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { OwlModule } from 'ngx-owl-carousel';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderBillComponent } from './order-bill/order-bill.component';
import { OrderPaymentDetailsComponent } from './order-payment-details/order-payment-details.component';
import { MatStepperModule } from '@angular/material/stepper';
import { PaymentComponent } from './payment/payment.component';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
@NgModule({
    declarations: [
        ItemDetailsComponent,
        OrderHistoryComponent,
        OrderBillComponent,
        OrderPaymentDetailsComponent,
        PaymentComponent

    ],
    imports: [
        ConsumerOrderRoutingModule,
        BreadCrumbModule,
        CommonModule,
        SharedModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule,
        HeaderModule,
        MaterialModule,
        OwlModule,
        MatStepperModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true })
    ],
    exports: [

    ]
})
export class ConsumerOrderModule { }
