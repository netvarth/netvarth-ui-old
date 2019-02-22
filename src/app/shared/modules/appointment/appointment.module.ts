import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { CheckinAddMemberModule } from '../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';

import { AppointmentComponent } from './appointment.component';
import { AppointmentInnerComponent } from './appointment-inner/appointment-inner.component';


@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        FormsModule,
        CheckinAddMemberModule
    ],
    entryComponents: [
        AppointmentComponent
    ],
    declarations: [
        AppointmentComponent,
        AppointmentInnerComponent
    ],
    exports: [AppointmentInnerComponent]
})
export class AppointmentModule {
}
