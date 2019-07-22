import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { ConsumerFaqComponent } from './consumer-faq.component';
import { ConsumerFaqRoutingModule } from './consumer-faq-routing.module';

@NgModule({
    imports: [
        ConsumerFaqRoutingModule,
        CommonModule,
        SharedModule,
        MaterialModule
    ],
    declarations: [
        ConsumerFaqComponent
    ],
    exports: [ConsumerFaqComponent]
})
export class ConsumerFaqModule {}

