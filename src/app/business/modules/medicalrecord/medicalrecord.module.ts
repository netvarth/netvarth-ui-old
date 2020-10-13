import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalrecordRoutingModule } from './medicalrecord.routing.module';
import { MedicalrecordComponent } from './medicalrecord.component';
import { GeneralComponent } from './general/general.component';
import { ClinicalnotesComponent } from './clinicalnotes/clinicalnotes.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { MedicalrecordService } from './medicalrecord.service';
import { LastVisitComponent } from './last-visit/last-visit.component';
import { MatFormFieldModule, MatInputModule, MatDatepickerModule } from '@angular/material';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { HomeComponent } from './home/home.component';
import { AddDrugComponent } from './prescription/add-drug/add-drug.component';
import { ShareRxComponent } from './prescription/share-rx/share-rx.component';
import { UploadPrescriptionComponent } from './prescription/upload-prescription/upload-prescription.component';
import { DrugListComponent } from './prescription/drug-list/drug-list.component';




@NgModule({
  declarations: [MedicalrecordComponent, GeneralComponent, ClinicalnotesComponent, PrescriptionComponent, LastVisitComponent, HomeComponent, AddDrugComponent, ShareRxComponent, UploadPrescriptionComponent, DrugListComponent],
  imports: [
    SharedModule,
    CommonModule,
    LoadingSpinnerModule,
    MedicalrecordRoutingModule,
    CapitalizeFirstPipeModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  entryComponents: [
  LastVisitComponent,
  AddDrugComponent,
  ShareRxComponent
  ],
  providers: [
    MedicalrecordService
  ]
})
export class MedicalrecordModule { }
