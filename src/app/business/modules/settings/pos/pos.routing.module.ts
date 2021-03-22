import { NgModule } from '@angular/core';
import { POSComponent } from './pos.component';
import { Routes, RouterModule } from '@angular/router';
import { ProviderReimburseReportComponent } from '../../../../ynw_provider/components/provider-reimburse-report/provider-reimburse-report.component';
import { ViewReportComponent } from '../../../../ynw_provider/components/view-report/view-report.component';
import { ProviderJcouponDetailsComponent } from '../../../../ynw_provider/components/provider-jcoupon-details/provider-jcoupon-details.component';

const routes: Routes = [
    { path: '', component: POSComponent },
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
        path: 'items', loadChildren: () => import('./items/items.module').then(m => m.ItemsModule)
    },
    {
        path: 'coupon', loadChildren: () => import('./coupons/pos-coupons.module').then(m => m.CouponsModule)
    },
    {
        path: 'discount', loadChildren: () => import('./discount/discount.module').then(m => m.DiscountModule)
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class POSRoutingModule { }
