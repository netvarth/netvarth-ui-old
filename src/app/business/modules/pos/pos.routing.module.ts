import { NgModule } from '@angular/core';
import { POSComponent } from './pos.component';
import { Routes, RouterModule } from '@angular/router';
import { ProviderDiscountsComponent } from '../../../ynw_provider/components/provider-discounts/provider-discounts.component';
import { ProviderCouponsComponent } from '../../../ynw_provider/components/provider-coupons/provider-coupons.component';
import { ProviderReimburseReportComponent } from '../../../ynw_provider/components/provider-reimburse-report/provider-reimburse-report.component';
import { ViewReportComponent } from '../../../ynw_provider/components/view-report/view-report.component';
import { ProviderJcouponDetailsComponent } from '../../../ynw_provider/components/provider-jcoupon-details/provider-jcoupon-details.component';
import { ProviderItemsComponent } from '../../../ynw_provider/components/provider-items/provider-items.component';
import { ProviderItemsDetailsComponent } from '../../../ynw_provider/components/provider-items-details/provider-items-details.component';
import { ProvidertaxSettingsComponent } from '../../../ynw_provider/components/provider-tax-settings/provider-tax-settings.component';
import { ProviderPaymentSettingsComponent } from '../../../ynw_provider/components/provider-payment-settings/provider-payment-settings.component';

const routes: Routes = [
    { path: '', component: POSComponent },
    {
        path: 'discounts',
        component: ProviderDiscountsComponent
    },
    {
        path: 'coupons',
        component: ProviderCouponsComponent
    },
    {
        path: 'coupons',
        children: [
            {
                path: 'report',
                component: ProviderReimburseReportComponent
            },
            {
                path: 'report/:id',
                component: ViewReportComponent
            }
        ]
    },
    {
        path: 'coupons/:id',
        component: ProviderJcouponDetailsComponent
    },
    {
        path: 'items', loadChildren: './items/items.module#ItemsModule'
    },
    {
        path: 'taxsettings',
        component: ProvidertaxSettingsComponent
    },
    {
        path: 'paymentsettings',
        component: ProviderPaymentSettingsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class POSRoutingModule { }
