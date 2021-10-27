import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PhomeComponent } from './phome.component';
import { OwlModule } from 'ngx-owl-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
        { path: 'signup', loadChildren: () => import('../signup/providersignup.module').then(m => m.ProvidersignupModule) },
        { path: 'login', loadChildren: () => import('../login/provider-login.module').then(m => m.ProviderLoginModule) },
      ]
    }];
@NgModule({
    imports: [
        CommonModule,
        OwlModule,
        HeaderModule,
        FooterModule,
        [RouterModule.forChild(routes)],
        FormsModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        ProvidersignupModule,
        ForgotPasswordModule,
        MatFormFieldModule,
        LoginModule
    ],
    declarations: [
        PhomeComponent
    ],
    exports: [PhomeComponent]
})

export class PhomeModule { }
