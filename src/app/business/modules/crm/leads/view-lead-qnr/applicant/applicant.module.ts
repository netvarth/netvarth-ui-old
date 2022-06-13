import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicantComponent } from './applicant.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';



@NgModule({
  declarations: [
    ApplicantComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormMessageDisplayModule,
    MatSelectModule,
    MatOptionModule,
    CapitalizeFirstPipeModule
  ],
  exports: [
    ApplicantComponent
  ]
})
export class ApplicantModule { }
