import { NgModule } from '@angular/core';
import { PosCouponsComponent } from './pos-coupons.component';
import { CommonModule } from '@angular/common';
import { ConfirmBoxModule } from '../../../../../../shared/components/confirm-box/confirm-box.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
    { path: '', component: PosCouponsComponent },
    { path: ':id', loadChildren: ()=> import('../create-coupon/create-coupon.module').then(m=>m.CreateCouponModule)},
    { path: ':id/publish', loadChildren: ()=> import('../publish-coupon/publish-coupon.module').then(m=>m.PublishCouponModule)}
];
@NgModule({
    declarations: [
        PosCouponsComponent
    ],
    imports: [
        CommonModule,
        MatTabsModule,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        ConfirmBoxModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [PosCouponsComponent]
})
export class CouponsModule {}
