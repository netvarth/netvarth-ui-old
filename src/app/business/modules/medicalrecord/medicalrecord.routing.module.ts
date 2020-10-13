import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicalrecordComponent } from './medicalrecord.component';
import { GeneralComponent } from './general/general.component';
import { ClinicalnotesComponent } from './clinicalnotes/clinicalnotes.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { HomeComponent } from './home/home.component';
import { UploadPrescriptionComponent } from './prescription/upload-prescription/upload-prescription.component';
import { DrugListComponent } from './prescription/drug-list/drug-list.component';


const routes: Routes = [
  {
    path: '', component: MedicalrecordComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home', component: HomeComponent, children: [
          { path: '', redirectTo: 'clinicalnotes', pathMatch: 'full' },
          { path: 'clinicalnotes', component: ClinicalnotesComponent },
          { path: 'prescription', component: PrescriptionComponent }


        ]
      },
      { path: 'general', component: GeneralComponent },
      { path: 'uploadRx', component: UploadPrescriptionComponent },
      { path: 'addrxlist', component: DrugListComponent}]
      
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class MedicalrecordRoutingModule {

}
