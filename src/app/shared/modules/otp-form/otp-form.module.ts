import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { OtpFormComponent } from './otp-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    declarations: [
        OtpFormComponent
    ],
    exports: [OtpFormComponent]
})
export class OtpFormModule {
}
