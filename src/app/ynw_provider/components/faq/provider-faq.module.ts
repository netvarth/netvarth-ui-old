import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { ProviderFaqRoutingModule } from './provider-faq-routing.module';
import { ProviderFaqComponent } from './provider-faq.component';

@NgModule({
    imports: [
        ProviderFaqRoutingModule,
        CommonModule,
        SharedModule,
        MaterialModule
    ],
    declarations: [
        ProviderFaqComponent
    ],
    exports: [ProviderFaqComponent]
})
export class ProviderFaqModule {}
