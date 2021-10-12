import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PhomeRoutingModule } from './phome-routing.module';
import { PhomeComponent } from './phome.component';
import { OwlModule } from 'ngx-owl-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PricingModule } from '../pricing/pricing.module';
import { ContactusModule } from '../contactus/contactus.module';
import { LazyModule } from '../../lazy-load/lazy.module';
import { FormMessageDisplayModule } from '../../form-message-display/form-message-display.module';
import { ProvidersignupModule } from '../signup/providersignup.module';
import { ForgotPasswordModule } from '../../../../shared/components/forgot-password/forgot-password.module';
import { FooterModule } from '../../footer/footer.module';
import { HeaderModule } from '../../header/header.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ServicePageHealthcareComponent } from '../service-page-healthcare/service-page-healthcare.component';
import { LoginModule } from '../../../../shared/components/login/login.module';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
    imports: [
        CommonModule,
        OwlModule,
        HeaderModule,
        FooterModule,
        PhomeRoutingModule,
        RouterModule,
        LazyModule,
        FormsModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        PricingModule,
        ProvidersignupModule,
        ForgotPasswordModule,
        ContactusModule,
        MatFormFieldModule,
        LoginModule
    ],
    declarations: [
        PhomeComponent,
        ServicePageHealthcareComponent
    ],
    providers: [
        ScrollToService
    ],
    entryComponents: [
    ],
    exports: [PhomeComponent]
})

export class PhomeModule { }
