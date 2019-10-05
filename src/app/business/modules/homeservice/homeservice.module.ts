import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { GalleryModule } from '../../../shared/modules/gallery/gallery.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeServiceComponent } from './homeservice.component';
import { HomeserviceQueuesModule } from './queues/homeservice-queues.module';
import { HomeServiceRoutingModule } from './homeservice.routing.module';

@NgModule({
    imports: [
        CommonModule,
        HomeServiceRoutingModule,
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
        HomeserviceQueuesModule,
        // ProviderWaitlistOnlineCheckinModule,
        NgbTimepickerModule,
        // DepartmentModule
    ],
    declarations: [
        HomeServiceComponent
    ],
    exports: [
        HomeServiceComponent
    ]
})
export class HomeServiceModule {}
