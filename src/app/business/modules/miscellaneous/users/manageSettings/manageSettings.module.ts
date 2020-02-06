import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { GalleryModule } from '../../../../../shared/modules/gallery/gallery.module';
import { ManageSettingsComponent } from './manageSettings.component';
import { ManageSettingsRoutingModule } from './manageSettings.routing.module';
import { ProviderWaitlistLocationDetailComponent } from '../../../../../ynw_provider/components/provider-waitlist-location-detail/provider-waitlist-location-detail.component';
import { DepartmentsComponent } from '../../../../../ynw_provider/components/departments/departments.component';
import { DepartmentDetailComponent } from '../../../../../ynw_provider/components/departments/details/department.details.component';
import { ProviderWaitlistLocationsModule } from '../../../../../ynw_provider/components/provider-waitlist-locations/provider-waitlist-locations.module';
import { ProviderWaitlistOnlineCheckinModule } from '../../../../../ynw_provider/components/provider-waitlist-online-checkin/provider-waitlist-online-checkin.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentModule } from '../../../../../ynw_provider/shared/modules/department/department.module';
import { WaitlistQueuesModule } from './queues/waitlist-queues.module';
@NgModule({
    imports: [
        CommonModule,
        ManageSettingsRoutingModule,
        BreadCrumbModule,
        LoadingSpinnerModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        MatSlideToggleModule,
        FormsModule,
        ReactiveFormsModule,
        ModalGalleryModule,
        //GalleryModule,
        //ProviderWaitlistLocationsModule,
        //ProviderWaitlistOnlineCheckinModule,
        NgbTimepickerModule,
        //DepartmentModule,
        WaitlistQueuesModule
    ],
    declarations: [
        ManageSettingsComponent,
       // ProviderWaitlistLocationDetailComponent,
       // DepartmentsComponent,
       // DepartmentDetailComponent
    ],
    exports: [
        ManageSettingsComponent
    ]
})
export class WaitlistMgrModule { }
