import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { CheckinAddMemberComponent } from './checkin-add-member.component';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        FormsModule,
        CapitalizeFirstPipeModule
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
