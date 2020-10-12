import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalrecordRoutingModule } from './medicalrecord.routing.module';
import { MedicalrecordComponent } from './medicalrecord.component';
import { GeneralComponent } from './general/general.component';
import { HomeComponent } from './home/home.component';
import { ClinicalnotesComponent } from './home/clinicalnotes/clinicalnotes.component';
import { PrescriptionComponent } from './home/prescription/prescription.component';



@NgModule({
  declarations: [MedicalrecordComponent, GeneralComponent, HomeComponent, ClinicalnotesComponent, PrescriptionComponent],
  imports: [
    CommonModule,
    MedicalrecordRoutingModule
  ]
})
export class MedicalrecordModule { }
