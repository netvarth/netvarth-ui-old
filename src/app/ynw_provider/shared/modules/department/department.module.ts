import { NgModule } from '@angular/core';
import { DepartmentComponent } from './department.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FormMessageDisplayModule,
        CapitalizeFirstPipeModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule
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
