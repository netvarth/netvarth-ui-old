import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
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
import { LoginModule } from '../../../../shared/components/login/login.module';
import { AuthGuardHome } from '../../../../shared/guard/auth.guard';
const routes: Routes = [
    { path: '', component: PhomeComponent, canActivate: [AuthGuardHome] },
    {
      path: '', children: [
        { path: 'healthcare', loadChildren: () => import('../service-page-healthcare/service-page-healthcare.module').then(m => m.ServicePageHealthcareModule) },
        { path: 'pricing', loadChildren: () => import('../pricing/pricing.module').then(m => m.PricingModule) },
        { path: 'signup', loadChildren: () => import('../signup/providersignup.module').then(m => m.ProvidersignupModule) },
        { path: 'login', loadChildren: () => import('../login/provider-login.module').then(m => m.ProviderLoginModule) },
        { path: 'contactus', loadChildren: () => import('../contactus/contactus.module').then(m => m.ContactusModule) },
        { path: 'aboutus', loadChildren: () => import('../about/about.module').then(m => m.AboutModule) }
      ]
    }];
@NgModule({
    imports: [
        CommonModule,
        OwlModule,
        HeaderModule,
        FooterModule,
        [RouterModule.forChild(routes)],
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
        PhomeComponent
    ],
    exports: [PhomeComponent]
})

export class PhomeModule { }
