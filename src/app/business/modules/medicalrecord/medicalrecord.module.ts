import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalrecordRoutingModule } from './medicalrecord.routing.module';
import { MedicalrecordComponent } from './medicalrecord.component';
import { GeneralComponent } from './general/general.component';
import { ClinicalnotesComponent } from './clinicalnotes/clinicalnotes.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { MedicalrecordService } from './medicalrecord.service';
import { LastVisitComponent } from './last-visit/last-visit.component';




@NgModule({
  declarations: [MedicalrecordComponent, GeneralComponent, ClinicalnotesComponent, PrescriptionComponent, LastVisitComponent],
  imports: [
    CommonModule,
    MedicalrecordRoutingModule
  ],
  entryComponents: [
  LastVisitComponent
  ],
  providers: [
    MedicalrecordService
  ]
})
export class MedicalrecordModule { }
