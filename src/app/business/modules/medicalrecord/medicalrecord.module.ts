import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalrecordComponent } from './medicalrecord.component';
import { MedicalrecordService } from './medicalrecord.service';
import { MatTabsModule } from '@angular/material/tabs';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { RouterModule, Routes } from '@angular/router';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { LastVisitModule } from './last-visit/last-visit.module';
import { ClinicalnotesComponent } from './clinicalnotes/clinicalnotes.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { ClinicalnotesModule } from './clinicalnotes/clinicalnotes.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { MatTableModule } from '@angular/material/table';
const routes: Routes = [
  {
    path: '', component: MedicalrecordComponent, children: [
      { path: '', redirectTo: 'clinicalnotes', pathMatch: 'full' },
      { path: 'clinicalnotes', component: ClinicalnotesComponent },
      { path: 'prescription', component: PrescriptionComponent },
      // { path: 'clinicalnotes', loadChildren: () => import('./clinicalnotes/clinicalnotes.module').then(m => m.ClinicalnotesModule) },
      // { path: 'prescription', loadChildren: () => import('./prescription/prescription.module').then(m => m.PrescriptionModule) }
    ]
  },
  { path: 'list', loadChildren: () => import('./medicalrecord-list/medicalrecord-list.module').then(m => m.MedicalrecordListModule) },
  { path: 'edit', loadChildren: () => import('./general/general.module').then(m => m.GeneralModule) },
  { path: 'uploadRx', loadChildren: () => import('./prescription/upload-prescription/upload-prescription.module').then(m => m.UploadPrescriptionModule) },
  { path: 'addrxlist', loadChildren: () => import('./prescription/drug-list/drug-list.module').then(m => m.DrugListModule) },
  { path: 'uploadsign', loadChildren: () => import('./prescription/upload-digital-signature/upload-digital-signature.module').then(m => m.UploadDigitalSignatureModule) },
  { path: 'uploadsignature', loadChildren: () => import('./prescription/upload-digital-signature/uploadsignature/uploadsignature.module').then(m => m.UploadSignatureModule) },
  { path: 'manualsignature', loadChildren: () => import('./prescription/upload-digital-signature/manualsignature/manualsignature.module').then(m => m.ManualSignatureModule) },
  { path: 'fileupload', loadChildren: () => import('./uploadfile/uploadfile.module').then(m => m.UploadfileModule) },

];
@NgModule({
  declarations: [MedicalrecordComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    LoadingSpinnerModule,
    CapitalizeFirstPipeModule,
    ActivityLogModule,
    LastVisitModule,
    ClinicalnotesModule,
    PrescriptionModule,
    [RouterModule.forChild(routes)]
  ],
  providers: [
    MedicalrecordService
  ],
  exports: [MedicalrecordComponent]
})
export class MedicalrecordModule { }
