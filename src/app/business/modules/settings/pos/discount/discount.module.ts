import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { GalleryModule } from '../../../../../shared/modules/gallery/gallery.module';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { DiscountRoutingModule } from './discount.routing.module';
import { DiscountComponent } from './discount.component';
import { DiscountDetailsComponent } from './details/discountdetails.component';

@NgModule({
    declarations: [
        DiscountComponent,
        DiscountDetailsComponent
    ],
    imports: [
        DiscountRoutingModule,
        BreadCrumbModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        GalleryModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        ReactiveFormsModule
    ],
    exports: [DiscountComponent]
})
export class DiscountModule {}
