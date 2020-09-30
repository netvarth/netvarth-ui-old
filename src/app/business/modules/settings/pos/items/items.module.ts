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
        OrderModule
    ],
    exports: [ItemsComponent]
})
export class ItemsModule {}
