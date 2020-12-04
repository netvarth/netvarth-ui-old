import { NgModule } from '@angular/core';
import { ItemsComponent } from './items.component';
import { ItemDetailsComponent } from './details/item-details.component';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemsRoutingModule } from './items.routing.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { GalleryModule } from '../../../../../shared/modules/gallery/gallery.module';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { OrderModule } from 'ngx-order-pipe';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { TruncateModule } from '../../../../../shared/pipes/limitTo.module';

@NgModule({
    declarations: [
        ItemsComponent,
        ItemDetailsComponent
    ],
    imports: [
        ItemsRoutingModule,
        BreadCrumbModule,
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
    exports: [ItemsComponent]
})
export class ItemsModule {}
