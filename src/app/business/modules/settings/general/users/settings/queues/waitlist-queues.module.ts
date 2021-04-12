import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { WaitlistQueuesComponent } from './list/waitlist-queues.component';
import { WaitlistQueueDetailComponent } from './details/waitlist-queuedetail.component';
import { WaitlistQueuesRoutingModule } from './waitlist-queues.routing.module';
import { LoadingSpinnerModule } from '../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../../../shared/modules/common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizeFirstPipeModule } from '../../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../../shared/modules/form-message-display/form-message-display.module';

@NgModule({
    imports: [
        CommonModule,
        BreadCrumbModule,
        WaitlistQueuesRoutingModule,
        LoadingSpinnerModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        NgbTimepickerModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule
    ],
    declarations: [
        WaitlistQueuesComponent,
        WaitlistQueueDetailComponent
    ],
    exports: [WaitlistQueuesComponent]
})
export class WaitlistQueuesModule { }
