import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadCrumbModule } from '../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { WaitlistSchedulesComponent } from './waitlist-schedules.component';
import { LoadingSpinnerModule } from '../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../../shared/modules/common/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { ShowMessagesModule } from '../../../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    { path: '', component: WaitlistSchedulesComponent },
    { path: ':sid', loadChildren: ()=>import('../details/waitlist-schedulesdetail.module').then(m=>m.WaitlistSchedulesdetailModule)}
];
@NgModule({
    imports: [
        CommonModule,
        BreadCrumbModule,
        LoadingSpinnerModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTimepickerModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        ShowMessagesModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        WaitlistSchedulesComponent
    ],
    exports: [WaitlistSchedulesComponent]
})
export class WaitlistSchedulesModule {}
