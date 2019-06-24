import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { CapitalizeFirstPipeModule  } from '../../../shared/pipes/capitalize.module';

import { ViewBillComponent } from './view-bill.component';

@NgModule({
    imports: [
      CapitalizeFirstPipeModule,
      CommonModule,
      RouterModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      FormMessageDisplayModule
    ],
    declarations: [
      ViewBillComponent
    ],
    exports: [
      ViewBillComponent
    ],
    providers: []
})

export class ViewBillModule {
}
