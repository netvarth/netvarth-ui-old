import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { WaitlistQueuesComponent } from './waitlist-queues.component';
import { WaitlistQueueDetailComponent } from '../details/waitlist-queuedetail.component';
import { LoadingSpinnerModule } from '../../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../../../../shared/modules/common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizeFirstPipeModule } from '../../../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { ShowMessagesModule } from '../../../../../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    { path: '', component: WaitlistQueuesComponent },
    { path: ':sid', component: WaitlistQueueDetailComponent }
];
@NgModule({
    imports: [
        CommonModule,
        BreadCrumbModule,
        LoadingSpinnerModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        NgbTimepickerModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        ShowMessagesModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        WaitlistQueuesComponent,
        WaitlistQueueDetailComponent
    ],
    exports: [WaitlistQueuesComponent]
})
export class WaitlistQueuesModule { }
