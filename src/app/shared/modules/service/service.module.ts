import { NgModule } from '@angular/core';
import { ServiceComponent } from './service.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormMessageDisplayModule } from '../form-message-display/form-message-display.module';
import { MaterialModule } from '../common/material.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { SharedModule } from '../common/shared.module';

@NgModule({
    imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        SharedModule
    ],
    declarations: [ServiceComponent],
    exports: [ServiceComponent]
})

export class ServiceModule {}
