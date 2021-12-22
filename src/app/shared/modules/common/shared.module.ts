import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
// import { HeaderModule } from '../../../shared/modules/header/header.module';
import { FooterModule } from '../../../shared/modules/footer/footer.module';
<<<<<<< HEAD
import { EditProfileModule } from '../../../shared/modules/edit-profile/edit-profile.module';
=======
>>>>>>> refs/remotes/origin/jaldee-payment-profile-latest
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
<<<<<<< HEAD
        // HeaderModule,
        EditProfileModule,
=======
>>>>>>> refs/remotes/origin/jaldee-payment-profile-latest
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
<<<<<<< HEAD
        EditProfileModule,
=======
        // EditProfileModule,
        // ChangePasswordModule,
        // ChangeMobileModule,
>>>>>>> refs/remotes/origin/jaldee-payment-profile-latest
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
