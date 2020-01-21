import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { GalleryModule } from '../../../../shared/modules/gallery/gallery.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { discountRoutingModule } from './discount.routing.module';
import { discountcomponent } from './discount.component';
import { discountdetailscomponent } from './details/discountdetails.component';

@NgModule({
    declarations: [
    
        discountcomponent,
        discountdetailscomponent
        

    ],
    imports: [
        discountRoutingModule,
        BreadCrumbModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        GalleryModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        ReactiveFormsModule
       
    ],
    exports: [discountcomponent]
})
export class discountModule {}
