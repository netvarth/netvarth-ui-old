import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { GalleryModule } from '../../../../../shared/modules/gallery/gallery.module';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { OrderModule } from 'ngx-order-pipe';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { TruncateModule } from '../../../../../shared/pipes/limitTo.module';
import { StoreDetailsComponent } from './store-details.component';
import { StoreDetailsRoutingModule } from './store-details.routing.module';
import { EditStoreDetailsComponent } from './details/edit-store-details.component';

@NgModule({
    declarations: [
        StoreDetailsComponent,
        EditStoreDetailsComponent
    ],
    imports: [
        BreadCrumbModule,
        StoreDetailsRoutingModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        GalleryModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        OrderModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        TruncateModule,
        CapitalizeFirstPipeModule,
    ],
    exports: [StoreDetailsComponent]
})
export class StoreDetailsModule {}
