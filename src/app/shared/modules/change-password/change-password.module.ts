import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { ChangePasswordComponent } from './change-password.component';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        BreadCrumbModule
    ],
    declarations: [
        ChangePasswordComponent
    ],
    exports: [ChangePasswordComponent]
})
export class ChangePasswordModule {
}
