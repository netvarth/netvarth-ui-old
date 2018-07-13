import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { CheckinAddMemberModule } from '../../../shared/modules/checkin-add-member/checkin-add-member.module';

import { CheckInComponent } from './check-in.component';
import { CheckInInnerComponent } from './check-in-inner/check-in-inner.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        FormsModule,
        CheckinAddMemberModule
    ],
    entryComponents: [
        CheckInComponent
    ],
    declarations: [
        CheckInComponent,
        CheckInInnerComponent
    ],
    exports: [CheckInInnerComponent]
})
export class CheckInModule {
}
