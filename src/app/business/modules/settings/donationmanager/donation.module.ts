import { NgModule } from '@angular/core';
import { DonationCauseListComponent } from './list/donation-list.component';
import { DonationDetailComponent } from './detail/donation-detail.component';
import { CommonModule } from '@angular/common';
import { DonationRoutingModule } from './donation.routing.module';
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
import { donationcomponent } from './donation.component';

@NgModule({
    imports: [
        CommonModule,
        DonationRoutingModule,
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
        DonationCauseListComponent,
        DonationDetailComponent,
        donationcomponent
    ],
    exports: [
        DonationCauseListComponent ,
        donationcomponent
    ],
    providers: [
        ServicesService
    ]
})
export class DonationModule { }
