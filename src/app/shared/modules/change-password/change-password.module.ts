import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { ChangePasswordComponent } from './change-password.component';
import { HeaderModule } from '../header/header.module';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
    { path: '', component: ChangePasswordComponent }
];
@NgModule({
    imports: [
        CommonModule,
        [RouterModule.forChild(routes)],
        ReactiveFormsModule,
        FormMessageDisplayModule,
        HeaderModule,
        MatButtonModule
    ],
    declarations: [
        ChangePasswordComponent
    ],
    exports: [ChangePasswordComponent]
})
export class ChangePasswordModule {
}
