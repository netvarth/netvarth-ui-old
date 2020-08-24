import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderModule } from '../../modules/header/header.module';
import { MaterialModule } from '../../modules/common/material.module';
import { FooterModule } from '../../modules/footer/footer.module';

import { FormMessageDisplayModule } from '../../modules/form-message-display/form-message-display.module';
import { ProviderotpComponent } from './providerotp.component';
import { providerOtpRoutingModule } from './providerotp.routing.module';
@NgModule({
    imports: [
       CommonModule,
       FormsModule,
       HeaderModule,
       MaterialModule,
       FooterModule,
       providerOtpRoutingModule,
       ReactiveFormsModule,
       FormMessageDisplayModule
    ],
    declarations: [
        ProviderotpComponent
    ],
    entryComponents: [],
    exports: [ProviderotpComponent]
})
export class ProviderOtpModule {}
