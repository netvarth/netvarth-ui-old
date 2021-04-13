import { NgModule } from '@angular/core';
import { POSComponent } from './pos.component';
import { CommonModule } from '@angular/common';
import { POSRoutingModule } from './pos.routing.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { ViewReportComponent } from '../../../../ynw_provider/components/view-report/view-report.component';
import { ProviderJcouponDetailsComponent } from '../../../../ynw_provider/components/provider-jcoupon-details/provider-jcoupon-details.component';
import { ProviderReimburseReportModule } from '../../../../ynw_provider/components/provider-reimburse-report/provider-reimburse-report.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CouponsModule } from './coupons/pos-coupons.module';

@NgModule({
    imports: [
        CommonModule,
        POSRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        SharedModule,
        ProviderReimburseReportModule,
        LoadingSpinnerModule,
        CouponsModule
    ],
    declarations: [
        POSComponent,
        ViewReportComponent,
        ProviderJcouponDetailsComponent
    ],
    exports: [POSComponent]
})

export class POSModule {}
