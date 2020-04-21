import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProvidersignupComponent } from './providersignup.component';
import { HeaderModule } from '../../modules/header/header.module';
import { MaterialModule } from '../../modules/common/material.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { providersignupRoutingModule } from './providersignup.routing.module';
import { FieldErrorDisplayComponent } from '../../modules/form-message-display/field-error-display/field-error-display.component';
import { FormMessageDisplayModule } from '../../modules/form-message-display/form-message-display.module';
import { ProviderotpComponent } from '../providerotp/providerotp.component';
import { ProviderOtpModule } from '../providerotp/providerotp.module';
import { SalesChannelModule } from '../../modules/saleschannel/saleschannel.module';
@NgModule({
   
    imports: [
       
       CommonModule,
       FormsModule,
       HeaderModule,
       MaterialModule,
       FooterModule,
       providersignupRoutingModule,
       ReactiveFormsModule,
       FormMessageDisplayModule,
       ProviderOtpModule,
       SalesChannelModule

    ],
    declarations: [
        ProvidersignupComponent
    ],
    entryComponents: [],
    exports: [ProvidersignupComponent]
})
export class ProvidersignupModule {} 