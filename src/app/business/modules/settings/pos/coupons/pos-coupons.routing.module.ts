import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosCouponsComponent } from './list/pos-coupons.component';
import { PosCouponDetailComponent } from './details/pos-coupondetail.component';

const routes: Routes = [
    { path: '', component: PosCouponsComponent },
    { path: ':id', component: PosCouponDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CouponsRoutingModule {}
