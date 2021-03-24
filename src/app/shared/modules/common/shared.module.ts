import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
// import { HeaderModule } from '../../../shared/modules/header/header.module';
import { FooterModule } from '../../../shared/modules/footer/footer.module';
import { EditProfileModule } from '../../../shared/modules/edit-profile/edit-profile.module';
import { ChangePasswordModule } from '../../../shared/modules/change-password/change-password.module';
import { ChangeMobileModule } from '../../../shared/modules/change-mobile/change-mobile.module';
import { OtpFormModule } from '../../../shared/modules/otp-form/otp-form.module';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { NgBootstrapModule } from './ngbootstrap.module';

@NgModule({
    declarations   : [
    ],
    imports        : [
        MaterialModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        // HeaderModule,
        EditProfileModule,
        ChangePasswordModule,
        ChangeMobileModule,
        OtpFormModule,
        FooterModule,
        FormMessageDisplayModule,
        NgBootstrapModule

    ],
    exports        : [
        MaterialModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        // HeaderModule,
        OtpFormModule,
        EditProfileModule,
        ChangePasswordModule,
        ChangeMobileModule,
        FooterModule,
        FormMessageDisplayModule,
        NgBootstrapModule

    ],
    entryComponents: [
    ],
    providers      : [
      FormMessageDisplayService
    ]
})

export class SharedModule {

}
