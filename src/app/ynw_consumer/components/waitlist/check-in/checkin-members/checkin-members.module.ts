import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinMembersComponent } from './checkin-members.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';



@NgModule({
  declarations: [
    CheckinMembersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    MatCheckboxModule,
    CapitalizeFirstPipeModule
  ],
  exports: [
    CheckinMembersComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class CheckinMembersModule { }
