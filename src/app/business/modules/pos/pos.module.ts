import { NgModule } from '@angular/core';
import { POSComponent } from './pos.component';
import { CommonModule } from '@angular/common';
import { POSRoutingModule } from './pos.routing.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { ProviderDiscountsComponent } from '../../../ynw_provider/components/provider-discounts/provider-discounts.component';
import { ProviderCouponsComponent } from '../../../ynw_provider/components/provider-coupons/provider-coupons.component';
import { ViewReportComponent } from '../../../ynw_provider/components/view-report/view-report.component';
import { ProviderJcouponDetailsComponent } from '../../../ynw_provider/components/provider-jcoupon-details/provider-jcoupon-details.component';
import { ProviderReimburseReportModule } from '../../../ynw_provider/components/provider-reimburse-report/provider-reimburse-report.module';
import { ProviderItemsComponent } from '../../../ynw_provider/components/provider-items/provider-items.component';
import { ProviderItemsDetailsComponent } from '../../../ynw_provider/components/provider-items-details/provider-items-details.component';
import { ProvidertaxSettingsComponent } from '../../../ynw_provider/components/provider-tax-settings/provider-tax-settings.component';
import { AddProviderCouponsComponent } from '../../../ynw_provider/components/add-provider-coupons/add-provider-coupons.component';
import { AddProviderItemComponent } from '../../../ynw_provider/components/add-provider-item/add-provider-item.component';
import { AddProviderDiscountsComponent } from '../../../ynw_provider/components/add-provider-discounts/add-provider-discounts.component';
import { AddProviderItemImageComponent } from '../../../ynw_provider/components/add-provider-item-image/add-provider-item-image.component';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { ProviderPaymentSettingsComponent } from '../../../ynw_provider/components/provider-payment-settings/provider-payment-settings.component';
import { JDNComponent } from './jdn/jdn.component';

@NgModule({
    imports: [
        CommonModule,
        POSRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        SharedModule,
        ProviderReimburseReportModule,
        LoadingSpinnerModule
    ],
    declarations: [
        POSComponent,
        ProviderDiscountsComponent,
        ProviderCouponsComponent,
        ViewReportComponent,
        ProviderJcouponDetailsComponent,
        ProviderItemsComponent,
        ProviderItemsDetailsComponent,
        ProvidertaxSettingsComponent,
        AddProviderCouponsComponent,
        AddProviderItemComponent,
        AddProviderDiscountsComponent,
        AddProviderItemImageComponent,
        ProviderPaymentSettingsComponent,
        JDNComponent

    ],
    entryComponents: [
        AddProviderCouponsComponent,
        AddProviderItemComponent,
        AddProviderDiscountsComponent,
        AddProviderItemImageComponent
    ],
    exports: [POSComponent]
})

export class POSModule {}
