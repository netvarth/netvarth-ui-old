import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { HomeserviceQueuesComponent } from './list/homeservice-queues.component';
import { HomeserviceQueueDetailComponent } from './details/homeservice-queuedetails.component';
import { HomeserviceQueuesRoutingModule } from './homeservice-queues.routing.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';

@NgModule({
    imports: [
        CommonModule,
        BreadCrumbModule,
        HomeserviceQueuesRoutingModule,
        LoadingSpinnerModule,
        MaterialModule,
        ReactiveFormsModule,
        NgbTimepickerModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule
    ],
    declarations: [
        HomeserviceQueuesComponent,
        HomeserviceQueueDetailComponent
    ],
    exports: [HomeserviceQueuesComponent]
})
export class HomeserviceQueuesModule {}
