import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../form-message-display/form-message-display.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../common/material.module';
import { OrderModule } from 'ngx-order-pipe';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';

@NgModule({
    declarations: [
        DynamicFormComponent,
        DynamicFormQuestionComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        CommonModule,
        MaterialModule,
        OrderModule
    ],
    exports: [DynamicFormComponent]
})
export class DynamicFormModule {}
