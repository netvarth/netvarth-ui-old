import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignOfficerComponent } from './assign-officer.component';
// import { CapitalizeFirstPipe } from '../../../../../shared/pipes/capitalize.pipe';

import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';

import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AssignOfficerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SelectButtonModule,
    ButtonModule
  ],
  exports: [
    AssignOfficerComponent
  ]
})
export class AssignOfficerModule { }
