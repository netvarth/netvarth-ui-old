import { NgModule } from '@angular/core';
import { PosCouponsComponent } from './list/pos-coupons.component';
import { PosCouponDetailComponent } from './details/pos-coupondetail.component';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CouponsRoutingModule } from './pos-coupons.routing.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { GalleryModule } from '../../../../shared/modules/gallery/gallery.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';

@NgModule({
    declarations: [
        PosCouponsComponent,
        PosCouponDetailComponent
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
        ReactiveFormsModule
    ],
    exports: [PosCouponsComponent]
})
export class CouponsModule {}
