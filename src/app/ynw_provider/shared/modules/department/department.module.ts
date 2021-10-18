import { NgModule } from '@angular/core';
import { DepartmentComponent } from './department.component';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';

@NgModule({
    imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FormMessageDisplayModule,
        CapitalizeFirstPipeModule
    ],
    declarations: [
        DepartmentComponent
    ],
    exports: [
        DepartmentComponent
    ]
})
export class DepartmentModule {

}
