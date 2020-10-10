import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicalrecordComponent } from './medicalrecord.component';
import { ClinicalNotesComponent } from './clinical-notes/clinical-notes.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { UploadRxComponent } from './prescription/upload-rx/upload-rx.component';


const routes: Routes = [
  { path: '', component: MedicalrecordComponent ,
children: [
      {
        path: '', component: ClinicalNotesComponent
      },
      {
        path: 'clinicalnotes', component: ClinicalNotesComponent
      },
      {
        path: 'prescription', component: PrescriptionComponent
      },
       {
        path: 'uploadrx', component: UploadRxComponent
      }


    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MedicalRecordRoutingModule { }
