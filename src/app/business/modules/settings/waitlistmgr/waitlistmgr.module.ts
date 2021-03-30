import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { GalleryModule } from '../../../../shared/modules/gallery/gallery.module';
import { WaitlistMgrComponent } from './waitlistmgr.component';
import { WaitlistMgrRoutingModule } from './waitlistmgr.routing.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { WaitlistQueuesModule } from './queues/waitlist-queues.module';
import { SelectionService } from '../../../../shared/services/selectionService';
@NgModule({
    imports: [
        CommonModule,
        WaitlistMgrRoutingModule,
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
        NgbTimepickerModule,
        WaitlistQueuesModule
    ],
    declarations: [
        WaitlistMgrComponent
    ],
    exports: [
        WaitlistMgrComponent
    ],
    providers: [
        SelectionService
    ]
})
export class WaitlistMgrModule { }
