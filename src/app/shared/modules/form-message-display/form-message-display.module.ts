import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FieldErrorDisplayComponent } from './field-error-display/field-error-display.component';
import { FormSuccessDisplayComponent } from './form-success-display/form-success-display.component';
@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [FieldErrorDisplayComponent,
      FormSuccessDisplayComponent],
    exports: [FieldErrorDisplayComponent,
      FormSuccessDisplayComponent]
})
export class FormMessageDisplayModule { }
