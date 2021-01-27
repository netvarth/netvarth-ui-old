import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PhomeRoutingModule } from './phome-routing.module';
import { PhomeComponent } from './phome.component';
import { OwlModule } from 'ngx-owl-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PricingModule } from '../pricing/pricing.module';
// import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { ContactusModule } from '../contactus/contactus.module';
import { LazyModule } from '../../lazy-load/lazy.module';
import { FormMessageDisplayModule } from '../../form-message-display/form-message-display.module';
import { ProvidersignupModule } from '../signup/providersignup.module';
import { ForgotPasswordModule } from '../../../../shared/components/forgot-password/forgot-password.module';
// import { MaterialModule } from '../../common/material.module';
import { FooterModule } from '../../footer/footer.module';
import { HeaderModule } from '../../header/header.module';
import { MatFormFieldModule } from '@angular/material/form-field';

// import { ContactusComponent } from './contactus/contactus.component';
@NgModule({
    imports: [
        CommonModule,
        OwlModule,
        HeaderModule,
        FooterModule,
        PhomeRoutingModule,
        RouterModule,
        // MaterialModule,
        LazyModule,
        FormsModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        PricingModule,
        ProvidersignupModule,
        ForgotPasswordModule,
        ContactusModule,
        MatFormFieldModule
    ],
    declarations: [
        PhomeComponent,
        // ContactusComponent
       ],
         entryComponents: [
        ],
        exports: [PhomeComponent]
})

export class PhomeModule { }
