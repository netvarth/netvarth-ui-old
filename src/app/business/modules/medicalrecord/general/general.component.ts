import { Component, OnInit } from '@angular/core';
import { MedicalrecordService } from '../medicalrecord.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  Cnotes: string;
  patientDetails: any;
  userId: any;
  today = new Date();
  type;
  data;
  notes = {'complaints': '', 'symptoms': '', 'allergies': '','vaccinationHistory': '', 'observations': '', 'diagnosis': '', 'misc_notes': ''}

  constructor(
    private medicalrecord_service: MedicalrecordService,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.type = params.type;
      console.log(this.type);
      this.data = JSON.parse(params.data);
      this.Cnotes = this.data;
    });
    this.medicalrecord_service.patient_data.subscribe(data => {
      this.patientDetails = data;
      this.userId = this.patientDetails.id;
      console.log(this.userId);
    });
  }

  ngOnInit() {
  }
  save(Cnotes) {
    console.log(this.type);
    if (this.type === 'Symptoms') {
      this.notes.symptoms = this.Cnotes;
    } else if (this.type === 'allergies') {
      this.notes.allergies = this.Cnotes;
    } else if (this.type === 'diagnosis') {
      this.notes.diagnosis = this.Cnotes;
    } else if (this.type === 'observations') {
      this.notes.observations = this.Cnotes;
    } else if (this.type === 'complaints') {
      this.notes.complaints = this.Cnotes;
    } else if (this.type === 'vaccinationHistory') {
      this.notes.vaccinationHistory = this.Cnotes;
    } else if (this.type === 'misc_notes') {
      this.notes.misc_notes = this.Cnotes;
    }
    console.log(Cnotes);
    const post_itemdata = {
      'bookingType': 'NA',
      'consultationMode': 'EMAIL',
      'clinicalNotes': this.notes,
      'mrConsultationDate': this.today
    };
    console.log(post_itemdata, this.userId);
    // this.provider_services.createMedicalRecord(post_itemdata, this.userId)
    //   .subscribe((data) => {
    //     console.log(data);
    //   },
    //     error => {
    //       this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    //     });
    // this.provider_services.updateMrClinicalNOtes(post_itemdata, 52)
    //   .subscribe((data) => {
    //     console.log(data);
    //   },
    //     error => {
    //       this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    //     });
  }
}
