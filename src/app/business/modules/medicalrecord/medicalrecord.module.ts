import { NgModule } from '@angular/core';
import { MedicalRecordRoutingModule } from './medicalrecord.routing.module';
import { ClinicalNotesComponent } from './clinical-notes/clinical-notes.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { MedicalRecordService } from './medical-record.service';
import { ListMedicalRecordComponent } from './list-medical-record/list-medical-record.component';
 import { AddRxComponent } from './prescription/add-rx/add-rx.component';
import { MedicalrecordComponent } from './medicalrecord.component';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { UploadRxComponent } from './prescription/upload-rx/upload-rx.component';
import { MatFormFieldModule, MatInputModule, MatDatepickerModule } from '@angular/material';



@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    LoadingSpinnerModule,
    MedicalRecordRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  declarations: [
    MedicalrecordComponent,
    ClinicalNotesComponent,
    PrescriptionComponent,
    ListMedicalRecordComponent,
    UploadRxComponent,

  ],
  entryComponents: [AddRxComponent],
  exports: [MedicalrecordComponent],
   providers: [
     MedicalRecordService
    ]
})

export class MedicalRecordModule { }
