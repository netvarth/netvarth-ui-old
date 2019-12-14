import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { ConsumerLearnmoreComponent } from './consumer-learnmore.component';
import { ConsumerLearnmoreRoutingModule } from './consumer-learnmore-routing.module';

@NgModule({
    imports: [
        ConsumerLearnmoreRoutingModule,
        CommonModule,
        SharedModule,
        MaterialModule
    ],
    declarations: [
        ConsumerLearnmoreComponent
    ],
    exports: [ConsumerLearnmoreComponent]
})
export class ConsumerLearnmoreModule {}
