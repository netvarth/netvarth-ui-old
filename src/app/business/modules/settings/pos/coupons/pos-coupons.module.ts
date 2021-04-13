import { NgModule } from '@angular/core';
import { PosCouponsComponent } from './list/pos-coupons.component';
import { PosCouponDetailComponent } from './details/pos-coupondetail.component';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CouponsRoutingModule } from './pos-coupons.routing.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { GalleryModule } from '../../../../../shared/modules/gallery/gallery.module';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { CreateCouponComponent } from './create-coupon/create-coupon.component';
import { PublishCouponComponent } from './publish-coupon/publish-coupon.component';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { PublishDialogComponent } from './publish-coupon/publish-dialog/publish-dialog.component';

@NgModule({
    declarations: [
        PosCouponsComponent,
        PosCouponDetailComponent,
        CreateCouponComponent,
        PublishCouponComponent,
        PublishDialogComponent
    ],
    imports: [
        CouponsRoutingModule,
        BreadCrumbModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        GalleryModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        CapitalizeFirstPipeModule
    ],
    entryComponents: [
        PublishDialogComponent,
        ],
    exports: [PosCouponsComponent]
})
export class CouponsModule {}
