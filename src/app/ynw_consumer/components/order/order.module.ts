import { NgModule } from '@angular/core';

import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';

import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { ConsumerOrderRoutingModule } from './order.routing.module';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { MaterialModule } from '../../../shared/modules/common/material.module';

@NgModule({
    declarations: [
        ShoppingCartComponent

    ],
    imports: [
        ConsumerOrderRoutingModule,
        BreadCrumbModule,
        CommonModule,
        SharedModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule,
        HeaderModule,
        MaterialModule
    ],
    exports: [

    ]
})
export class ConsumerOrderModule { }
