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
import { ManageSettingsComponent } from './manageSettings.component';
import { ManageSettingsRoutingModule } from './manageSettings.routing.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { WaitlistQueuesModule } from './queues/waitlist-queues.module';
import { NotificationUserModule } from './notifications/notifications.module';
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
        NgbTimepickerModule,
        WaitlistQueuesModule,
        NotificationUserModule
    ],
    declarations: [
        ManageSettingsComponent,
    ],
    exports: [
        ManageSettingsComponent
    ]
})
export class ManageSettingsModule { }
