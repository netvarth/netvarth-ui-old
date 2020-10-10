import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
// import { MatDialog } from '@angular/material';
import { MedicalRecordService } from '../medical-record.service';

@Component({
  selector: 'app-clinical-notes',
  templateUrl: './clinical-notes.component.html',
  styleUrls: ['./clinical-notes.component.css']
})
export class ClinicalNotesComponent implements OnInit {

  currentMRId: any;
  patientDetails: any;
  userId;
  customerDetails: any;
  editclinicaldialogRef: any;

  constructor(

    public sharedfunction: SharedFunctions,
    public provider_services: ProviderServices,
    private medicalRecordService: MedicalRecordService) {
    this.medicalRecordService.patient_data.subscribe(res => {
      this.patientDetails = res;
    });
    this.medicalRecordService._mrUid.subscribe(res => {
      this.currentMRId = res;
    });
  }

    ngOnInit() {
      // this.getMRClinicalNotes();
    }

    // getMRClinicalNotes() {

    //   this.provider_services.getClinicalRecordOfMRById(this.currentMRId)
    //     .subscribe((data) => {
    //       console.log(data);
    //     },
    //       error => {
    //         this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    //       });
    //   // GetMedicalRecord

    // }
    // editClinicalNotes(type, data) {
    //   this.editclinicaldialogRef = this.dialog.open(EditClinicalNoteComponent, {
    //     width: '50%',
    //     panelClass: ['popup-class', 'commonpopupmainclass'],
    //     disableClose: true,
    //     data: {
    //       type: type,
    //       customer: this.customerDetails,
    //       data: data
    //     }
    //   });
      // this.mrdialogRef.afterClosed().subscribe(result => {
      //   console.log(result);
      // });

   // }

}
