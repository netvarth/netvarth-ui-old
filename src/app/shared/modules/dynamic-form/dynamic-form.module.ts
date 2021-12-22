import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../form-message-display/form-message-display.module';
import { CommonModule } from '@angular/common';
import { OrderModule } from 'ngx-order-pipe';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
        OrderModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatOptionModule,
        MatRadioModule,
        MatCheckboxModule,
        MatDatepickerModule
    ],
    exports: [DynamicFormComponent]
})
export class DynamicFormModule {}
