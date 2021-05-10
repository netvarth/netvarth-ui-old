import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { WaitlistServicesComponent } from './list/waitlist-services.component';
import { WaitlistServiceDetailComponent } from './details/waitlistservice-detail.component';
import { CommonModule } from '@angular/common';
import { WaitlistServicesRoutingModule } from './waitlist-services.routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { GalleryModule } from '../../../../../shared/modules/gallery/gallery.module';
import { ServicesService } from '../../../../../shared/modules/service/services.service';
import { ServiceModule } from '../../../../../shared/modules/service/service.module';
import { PagerModule } from '../../../../../shared/modules/pager/pager.module';
import { OrderModule } from 'ngx-order-pipe';
import { TableModule } from 'primeng/table'

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
        OrderModule,
        TableModule
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
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class WaitlistServicesModule { }
