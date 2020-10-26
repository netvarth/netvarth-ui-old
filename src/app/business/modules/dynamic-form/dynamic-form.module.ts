import { NgModule } from '@angular/core';
import { DynamicFormComponent } from '../../../ynw_provider/components/dynamicforms/dynamic-form.component';
import { DynamicFormQuestionComponent } from '../../../ynw_provider/components/dynamicforms/dynamic-form-question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { OrderModule } from 'ngx-order-pipe';

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
