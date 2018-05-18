import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';

import { AddMemberComponent } from './add-member.component';

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
        AddMemberComponent
    ],
    declarations: [
        AddMemberComponent
    ],
    exports: [AddMemberComponent]
})
export class AddMemberModule {
}
