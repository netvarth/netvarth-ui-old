import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { HomeserviceServicesRoutingModule } from './homeservice-services.routing.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { GalleryModule } from '../../../../shared/modules/gallery/gallery.module';
import { HomeserviceServiceDetailComponent } from './details/homeservice-servicedetail.component';
import { HomeserviceServicesComponent } from './list/homeservice-services.component';
import { ServiceModule } from '../../../../shared/modules/service/service.module';
import { ServicesService } from '../../../../shared/modules/service/services.service';

@NgModule({
    imports: [
        CommonModule,
        HomeserviceServicesRoutingModule,
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
        ServiceModule
    ],
    declarations: [
        HomeserviceServicesComponent,
        HomeserviceServiceDetailComponent
    ],
    exports: [
        HomeserviceServicesComponent
    ],
    providers: [
        ServicesService
    ]
})
export class HomeserviceServicesModule {}
