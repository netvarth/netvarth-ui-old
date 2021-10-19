import { NgModule } from '@angular/core';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { DisplayboardQSetComponent } from './displayboard-qset.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        DisplayboardQSetComponent
    ],
    imports: [
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        FormMessageDisplayModule,
        CapitalizeFirstPipeModule,
        CommonModule
    ],
    exports: [DisplayboardQSetComponent]
})
export class DisplayboardQSetModule { }
