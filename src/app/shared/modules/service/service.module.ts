import { NgModule } from '@angular/core';
import { ServiceComponent } from './service.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormMessageDisplayModule } from '../form-message-display/form-message-display.module';
import { MaterialModule } from '../common/material.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';

@NgModule({
    imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        CommonModule,
        CapitalizeFirstPipeModule
    ],
    declarations: [ServiceComponent],
    exports: [ServiceComponent]
})

export class ServiceModule {}
