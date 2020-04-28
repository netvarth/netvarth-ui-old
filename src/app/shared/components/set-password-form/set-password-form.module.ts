import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { SetPasswordFormComponent } from './set-password-form.component';
import { MaterialModule } from '../../modules/common/material.module';
import { SharedModule } from '../../modules/common/shared.module';



@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        SharedModule
    ],
    declarations: [
        SetPasswordFormComponent
    ],
    exports: [SetPasswordFormComponent]
})
export class SetPasswwordModule {
}
