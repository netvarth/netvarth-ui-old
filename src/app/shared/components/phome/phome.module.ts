import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PhomeRoutingModule } from './phome-routing.module';
import { PhomeComponent } from './phome.component';
import { OwlModule } from 'ngx-owl-carousel';
import { HeaderModule } from '../../modules/header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { MaterialModule } from '../../modules/common/material.module';
import { LazyModule } from '../../modules/lazy-load/lazy.module';
import { JaldeepricingComponent } from './pricing/jaldeepricing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../modules/form-message-display/form-message-display.module';
import { jaldeepricingModule } from './pricing/jaldeepricing.module';
import { ProvidersignupComponent } from '../providersignup/providersignup.component';
import { ProvidersignupModule } from '../providersignup/providersignup.module';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { ForgotPasswordModule } from '../forgot-password/forgot-password.module';
@NgModule({
    imports: [
        CommonModule,
        OwlModule,
        HeaderModule,
        FooterModule,
        PhomeRoutingModule,
        RouterModule,
        MaterialModule,
        LazyModule,
        FormsModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        jaldeepricingModule,
        ProvidersignupModule,
        ForgotPasswordModule
        
    ],
    declarations: [
        PhomeComponent
       ],
         entryComponents: [
            
       
        ],
        exports: [PhomeComponent]
})

export class PhomeModule { }
