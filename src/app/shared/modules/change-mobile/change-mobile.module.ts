import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';

import { ChangeMobileComponent } from './change-mobile.component';
import { ProviderSubeaderComponent } from '../../../ynw_provider/components/provider-subheader/provider-subheader.component';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { OtpFormModule } from '../../../shared/modules/otp-form/otp-form.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        BreadCrumbModule,
        OtpFormModule
    ],
    declarations: [
        ChangeMobileComponent
    ],
    exports: [ChangeMobileComponent]
})
export class ChangeMobileModule {
}
