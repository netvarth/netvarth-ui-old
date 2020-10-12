import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
 // import { MatDialog } from '@angular/material';
import { MedicalrecordService } from '../medicalrecord.service';

@Component({
  selector: 'app-clinicalnotes',
  templateUrl: './clinicalnotes.component.html',
  styleUrls: ['./clinicalnotes.component.css']
})
export class ClinicalnotesComponent implements OnInit {

  currentMRId: any;
  patientDetails: any;
  userId;
  customerDetails: any;
  editclinicaldialogRef: any;
  ClinicalNotes;
  symptoms: any;
  allergies: any;
  diagnosis: any;
  complaints: any;
  observations: any;
  misc_notes: any;

  constructor(

    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
   //  private dialog: MatDialog,
    private medicalrecordService: MedicalrecordService) {
    this.medicalrecordService.patient_data.subscribe(res => {
      this.patientDetails = res;
      console.log(this.patientDetails);
    });
    this.medicalrecordService._mrUid.subscribe(res => {
      this.currentMRId = res;
      console.log(this.currentMRId);
    });
  }

    ngOnInit() {
      this.getMRClinicalNotes();
      // this.getCheckinDetails();
    }
    // getCheckinDetails() {
    //   this.provider_services.getProviderWaitlistDetailById(this.uuid)
    //     .subscribe(
    //       data => {

    //       }, error => {
    //         this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //       }
    //     );
    // }

    getMRClinicalNotes() {
      this.provider_services.getClinicalRecordOfMRById(11)
        .subscribe((data) => {
          this.ClinicalNotes = data;
          this.allergies = this.ClinicalNotes.allergies;
          this.complaints = this.ClinicalNotes.complaints;
          this.diagnosis = this.ClinicalNotes.diagnosis;
          this.misc_notes = this.ClinicalNotes.misc_notes;
          this.observations = this.ClinicalNotes.observations;
          this.symptoms = this.ClinicalNotes.symptoms;
          console.log(this.ClinicalNotes);
          console.log(this.symptoms);
          console.log(this.allergies);
        },
          error => {
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
      // GetMedicalRecord

    }
    editClinicalNotes(type, data) {
      // this.editclinicaldialogRef = this.dialog.open(EditClinicalNoteComponent, {
      //   width: '50%',
      //   panelClass: ['popup-class', 'commonpopupmainclass'],
      //   disableClose: true,
      //   data: {
      //     type: type,
      //     customer: this.customerDetails,
      //     data: data
      //   }
      // });
      // this.mrdialogRef.afterClosed().subscribe(result => {
      //   console.log(result);
      // });

    }
}
