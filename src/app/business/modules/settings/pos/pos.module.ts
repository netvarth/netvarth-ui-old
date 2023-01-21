import { NgModule } from '@angular/core';
import { POSComponent } from './pos.component';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
    { path: '', component: POSComponent },
    {
        path: 'coupons', children: [
            { path: 'report', loadChildren: () => import('./coupons/provider-reimburse-report/provider-reimburse-report.module').then(m => m.ProviderReimburseReportModule) },
            { path: 'report/:id', loadChildren: () => import('./coupons/view-report/view-report.module').then(m => m.ViewReportModule) }
        ]
    },
    { path: 'coupons/:id', loadChildren: () => import('./coupons/provider-jcoupon-details/provider-jcoupon-details.module').then(m=>m.ProviderJcouponDetailsModule) },
    { path: 'items', loadChildren: () => import('./items/items.module').then(m => m.ItemsModule) },
    // { path: 'itemgroup', loadChildren: () => import('./itemgroup/itemgroup.module').then(m => m.ItemgroupModule) },
    // { path: 'itemgroup/:id', loadChildren: () => import('./itemgroup/itemgroup.module').then(m => m.ItemgroupModule) },
    // { path: 'itemlist', loadChildren: () => import('./itemlist/itemlist.module').then(m => m.ItemlistModule) },
    { path: 'coupon', loadChildren: () => import('./coupons/list/pos-coupons.module').then(m => m.CouponsModule) },
    { path: 'discount', loadChildren: () => import('./discount/discount.module').then(m => m.DiscountModule) }
];
@NgModule({
    imports: [
        CommonModule,
        MatSlideToggleModule,
        [RouterModule.forChild(routes)],
        FormsModule
    ],
    declarations: [
        POSComponent
    ],
    exports: [POSComponent]
})

export class POSModule {}
