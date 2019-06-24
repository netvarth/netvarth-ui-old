import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';

import { CheckinAddMemberComponent } from './checkin-add-member.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        FormsModule
    ],
    entryComponents: [
        CheckinAddMemberComponent
    ],
    declarations: [
        CheckinAddMemberComponent
    ],
    exports: [CheckinAddMemberComponent]
})
export class CheckinAddMemberModule {
}
