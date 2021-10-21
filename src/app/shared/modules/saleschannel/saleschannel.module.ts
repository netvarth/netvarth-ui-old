import { NgModule } from '@angular/core';
import { SalesChannelComponent } from './saleschannel.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [SalesChannelComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule
    ],
    exports: [SalesChannelComponent]
})
export class SalesChannelModule { }
