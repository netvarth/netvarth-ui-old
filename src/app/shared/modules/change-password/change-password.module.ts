import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { ChangePasswordComponent } from './change-password.component';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { HeaderModule } from '../header/header.module';
const routes: Routes = [
    { path: '', component: ChangePasswordComponent }
];
@NgModule({
    imports: [
        CommonModule,
        [RouterModule.forChild(routes)],
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        BreadCrumbModule,
        HeaderModule
    ],
    declarations: [
        ChangePasswordComponent
    ],
    exports: [ChangePasswordComponent]
})
export class ChangePasswordModule {
}
