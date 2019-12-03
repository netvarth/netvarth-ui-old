import { NgModule } from '@angular/core';
import { SalesChannelComponent } from './saleschannel.component';
import { MaterialModule } from '../common/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [SalesChannelComponent],
    imports: [MaterialModule,
        CommonModule,
    FormsModule],
    exports: [SalesChannelComponent]
})
export class SalesChannelModule {}
