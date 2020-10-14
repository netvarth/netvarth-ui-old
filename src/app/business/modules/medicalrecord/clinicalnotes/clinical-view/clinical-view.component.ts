import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { MedicalrecordService } from '../../medicalrecord.service';

@Component({
  selector: 'app-clinical-view',
  templateUrl: './clinical-view.component.html',
  styleUrls: ['./clinical-view.component.css']
})
export class ClinicalViewComponent implements OnInit {


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
  vaccinationHistory: any;
  Cdata;

  constructor(

    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private router: Router,
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
      this.provider_services.getClinicalRecordOfMRById(52)
        .subscribe((data) => {
          this.Cdata = data;
          this.allergies = this.Cdata.ClinicalNotes.allergies;
          this.complaints = this.Cdata.ClinicalNotes.complaints;
          this.diagnosis = this.Cdata.ClinicalNotes.diagnosis;
          this.misc_notes = this.Cdata.ClinicalNotes.misc_notes;
          this.observations = this.Cdata.ClinicalNotes.observations;
          this.symptoms = this.Cdata.ClinicalNotes.symptoms;
          this.vaccinationHistory = this.Cdata.ClinicalNotes.vaccinationHistory;
          this.misc_notes = this.Cdata.ClinicalNotes.misc_notes;
          console.log(this.Cdata);
          console.log(this.allergies);
        },
          error => {
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
      // GetMedicalRecord

    }
    addOrEditClinicalNotes(type, data) {
      const navigationExtras: NavigationExtras = {
        queryParams: { 'type': type,
                       'data': JSON.stringify(data) }
    };
    console.log(navigationExtras);
    console.log(type);

      this.router.navigate(['/provider/medicalrecord/home/clinicalnotes/edit'] , navigationExtras);
    }
}
