import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { ChangeMobileComponent } from './change-mobile.component';
import { OtpFormModule } from '../../../shared/modules/otp-form/otp-form.module';
import { HeaderModule } from '../header/header.module';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
    { path: '', component: ChangeMobileComponent }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        OtpFormModule,
        HeaderModule,
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        ChangeMobileComponent
    ],
    exports: [ChangeMobileComponent]
})
export class ChangeMobileModule {
}
