import { NgModule } from '@angular/core';
import { WaitlistServicesComponent } from './list/waitlist-services.component';
import { WaitlistServiceDetailComponent } from './details/waitlistservice-detail.component';
import { CommonModule } from '@angular/common';
import { WaitlistServicesRoutingModule } from './waitlist-services.routing.module';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { BreadCrumbModule } from '../../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { LoadingSpinnerModule } from '../../../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { GalleryModule } from '../../../../../../../shared/modules/gallery/gallery.module';
import { ServicesService } from '../../../../../../../shared/modules/service/services.service';
import { ServiceModule } from '../../../../../../../shared/modules/service/service.module';
import { PagerModule } from '../../../../../../../shared/modules/pager/pager.module';
import { OrderModule } from 'ngx-order-pipe';
@NgModule({
    imports: [
        CommonModule,
        WaitlistServicesRoutingModule,
        BreadCrumbModule,
        LoadingSpinnerModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        MatSlideToggleModule,
        FormsModule,
        ReactiveFormsModule,
        ModalGalleryModule,
        GalleryModule,
        ServiceModule,
        PagerModule,
        OrderModule
    ],
    declarations: [
        WaitlistServicesComponent,
        WaitlistServiceDetailComponent
    ],
    exports: [
        WaitlistServicesComponent
    ],
    providers: [
        ServicesService
    ]
})
export class WaitlistServicesModule { }
