import { NgModule } from '@angular/core';
import { DonationCauseListComponent } from './causes/causes.component';
import { CommonModule } from '@angular/common';
import { DonationMgrRoutingModule } from './donation-mgr.routing.module';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { GalleryModule } from '../../../../shared/modules/gallery/gallery.module';
import { ServicesService } from '../../../../shared/modules/service/services.service';
import { ServiceModule } from '../../../../shared/modules/service/service.module';
import { DonationMgrComponent } from './donation-mgr.component';
import { CauseDetailComponent } from './causes/detail/cause-details.component';
import { OrderModule } from 'ngx-order-pipe';
@NgModule({
    imports: [
        CommonModule,
        DonationMgrRoutingModule,
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
        OrderModule
    ],
    declarations: [
        DonationCauseListComponent,
        CauseDetailComponent,
        DonationMgrComponent
    ],
    exports: [
        DonationCauseListComponent ,
        DonationMgrComponent
    ],
    providers: [
        ServicesService
    ]
})
export class DonationMgrModule { }
