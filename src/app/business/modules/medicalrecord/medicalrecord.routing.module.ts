import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicalrecordComponent } from './medicalrecord.component';
import { HomeComponent } from './home/home.component';
import { ClinicalnotesComponent } from './home/clinicalnotes/clinicalnotes.component';
import { PrescriptionComponent } from './home/prescription/prescription.component';
import { GeneralComponent } from './general/general.component';


const routes: Routes = [
  {
    path: '', component: MedicalrecordComponent, children: [
      {
        path: '', component: HomeComponent, children: [
          { path: '', redirectTo: 'clinicalnotes', pathMatch: 'full' },
          { path: 'clinicalnotes', component: ClinicalnotesComponent },
          { path: 'prescription', component: PrescriptionComponent }

        ]
      },
      { path: 'general', component: GeneralComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalrecordRoutingModule {

}
