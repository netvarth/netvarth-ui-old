import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { ConsumerLearnmoreComponent } from './consumer-learnmore.component';
import { ConsumerLearnmoreRoutingModule } from './consumer-learnmore-routing.module';
import { HeaderModule } from '../../../shared/modules/header/header.module';

@NgModule({
    imports: [
        ConsumerLearnmoreRoutingModule,
        CommonModule,
        SharedModule,
        MaterialModule,
        HeaderModule
    ],
    declarations: [
        ConsumerLearnmoreComponent
    ],
    exports: [ConsumerLearnmoreComponent]
})
export class ConsumerLearnmoreModule {}
