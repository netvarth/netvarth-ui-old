import { NgModule } from '@angular/core';
import { POSComponent } from './pos.component';
import { CommonModule } from '@angular/common';
import { POSRoutingModule } from './pos.routing.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { ViewReportComponent } from '../../../../ynw_provider/components/view-report/view-report.component';
import { ProviderJcouponDetailsComponent } from '../../../../ynw_provider/components/provider-jcoupon-details/provider-jcoupon-details.component';
import { ProviderReimburseReportModule } from '../../../../ynw_provider/components/provider-reimburse-report/provider-reimburse-report.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CouponsModule } from './coupons/pos-coupons.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        POSRoutingModule,
        CapitalizeFirstPipeModule,
        ProviderReimburseReportModule,
        LoadingSpinnerModule,
        CouponsModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        RouterModule,
        FormsModule
    ],
    declarations: [
        POSComponent,
        ViewReportComponent,
        ProviderJcouponDetailsComponent
    ],
    exports: [POSComponent]
})

export class POSModule {}
