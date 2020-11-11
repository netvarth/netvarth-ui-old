import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicalrecordComponent } from './medicalrecord.component';
import { GeneralComponent } from './general/general.component';
import { UploadPrescriptionComponent } from './prescription/upload-prescription/upload-prescription.component';
import { DrugListComponent } from './prescription/drug-list/drug-list.component';
import { ClinicalnotesComponent } from './clinicalnotes/clinicalnotes.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { MedicalrecordListComponent } from './medicalrecord-list/medicalrecord-list.component';
import { UploadDigitalSignatureComponent } from './prescription/upload-digital-signature/upload-digital-signature.component';
import { UploadSignatureComponent } from './prescription/upload-digital-signature/uploadsignature/upload-signature.component';
import { ManualSignatureComponent } from './prescription/upload-digital-signature/manualsignature/manual-signature.component';



const routes: Routes = [
  {
    path: '', component: MedicalrecordComponent, children: [

      { path: '', redirectTo: 'clinicalnotes', pathMatch: 'full' },
      {
        path: 'clinicalnotes', component: ClinicalnotesComponent,
      },
      {
        path: 'prescription', component: PrescriptionComponent
      }
    ]
  },
  { path: 'list', component: MedicalrecordListComponent },
  { path: 'edit', component: GeneralComponent },
  { path: 'uploadRx', component: UploadPrescriptionComponent },
  { path: 'addrxlist', component: DrugListComponent },
  {path: 'uploadsign', component: UploadDigitalSignatureComponent},
  {path: 'uploadsignature', component: UploadSignatureComponent},
  {path: 'manualsignature', component: ManualSignatureComponent}



];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class MedicalrecordRoutingModule {

}

