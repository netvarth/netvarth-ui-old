import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { AddProviderNonworkingdaysComponent } from '../../../../ynw_provider/components/add-provider-nonworkingdays/add-provider-nonworkingdays.component';
import { ProviderNonworkingdaysComponent } from '../../../../ynw_provider/components/provider-nonworkingdays/provider-nonworkingdays.component';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { SalesChannelModule } from '../../../../shared/modules/saleschannel/saleschannel.module';
import { AppointmentmanagerComponent } from './appointmentmanager.component';
import { AppointmentmanagerRoutingModule } from './appointmentmanager.routing.module';
import { AppointmentComponent } from './appointment/appointment.component';
import { OwlModule } from 'ngx-owl-carousel';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { CheckinAddMemberModule } from '../../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
@NgModule({
    imports: [
        CommonModule,
        BreadCrumbModule,
        AppointmentmanagerRoutingModule,
        MaterialModule,
        FormsModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        NgbTimepickerModule,
        SharedModule,
        SalesChannelModule,
        Nl2BrPipeModule,
        OwlModule,
        CapitalizeFirstPipeModule,
        CheckinAddMemberModule
    ],
    declarations: [
        AppointmentmanagerComponent,
        AppointmentComponent
    ],
    entryComponents: [
       // AddProviderNonworkingdaysComponent
    ],
    exports: [AppointmentmanagerComponent]
})
export class AppointmentmanagerModule { }
