import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { AddMemberModule } from '../../../shared/modules/add-member/add-member.module';

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
        AddMemberModule
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
