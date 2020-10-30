import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalrecordRoutingModule } from './medicalrecord.routing.module';
import { MedicalrecordComponent } from './medicalrecord.component';
import { GeneralComponent } from './general/general.component';
import { ClinicalnotesComponent } from './clinicalnotes/clinicalnotes.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { MedicalrecordService } from './medicalrecord.service';
import { LastVisitComponent } from './last-visit/last-visit.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { AddDrugComponent } from './prescription/add-drug/add-drug.component';
import { ShareRxComponent } from './prescription/share-rx/share-rx.component';
import { UploadPrescriptionComponent } from './prescription/upload-prescription/upload-prescription.component';
import { DrugListComponent } from './prescription/drug-list/drug-list.component';
import { InstructionsComponent } from './prescription/instructions/instructions.component';
import { ImagesviewComponent } from './prescription/imagesview/imagesview.component';
import { MedicalrecordListComponent } from './medicalrecord-list/medicalrecord-list.component';
import { UploadDigitalSignatureComponent } from './prescription/upload-digital-signature/upload-digital-signature.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [MedicalrecordComponent,
     GeneralComponent,
      ClinicalnotesComponent,
       PrescriptionComponent,
        LastVisitComponent,
         AddDrugComponent,
          ShareRxComponent,
           UploadPrescriptionComponent,
            DrugListComponent ,
             InstructionsComponent,
              ImagesviewComponent,
              MedicalrecordListComponent,
              UploadDigitalSignatureComponent
            ],
  imports: [
    SharedModule,
    CommonModule,
    LoadingSpinnerModule,
    MedicalrecordRoutingModule,
    CapitalizeFirstPipeModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule
  ],
  entryComponents: [
  LastVisitComponent,
  AddDrugComponent,
  ShareRxComponent,
  InstructionsComponent,
  ImagesviewComponent
  ],
  providers: [
    MedicalrecordService
  ]
})
export class MedicalrecordModule { }
