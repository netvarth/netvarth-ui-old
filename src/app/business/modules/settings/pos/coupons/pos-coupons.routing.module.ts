import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosCouponsComponent } from './list/pos-coupons.component';
// import { PosCouponDetailComponent } from './details/pos-coupondetail.component';
import { CreateCouponComponent } from './create-coupon/create-coupon.component';
import { PublishCouponComponent } from './publish-coupon/publish-coupon.component';

const routes: Routes = [
    { path: '', component: PosCouponsComponent },
    // { path: ':id', component: PosCouponDetailComponent },
    { path: ':id', component: CreateCouponComponent },
    { path: ':id/publish', component: PublishCouponComponent }


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CouponsRoutingModule {}
