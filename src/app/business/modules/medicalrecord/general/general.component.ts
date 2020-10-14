import { Component, OnInit } from '@angular/core';
// import { MedicalrecordService } from '../medicalrecord.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  displayTitle: any;
  editable_object: any;
  clinicalNotes: any;
  edit_data: any;
  Cnotes: string;
  patientDetails: any;
  userId: any;
  today = new Date();
  type;
  data;
  notes = { 'complaints': '', 'symptoms': '', 'allergies': '', 'vaccinationHistory': '', 'observations': '', 'diagnosis': '', 'misc_notes': '' };

  constructor(
    // private medicalrecord_service: MedicalrecordService,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.editable_object = params.object;
      this.edit_data = this.editable_object.value;
      this.displayTitle = this.editable_object.displayName;
      this.clinicalNotes = params.clinicalNotes;

    });

  }

  ngOnInit() {
  }
  save(notes) {

    const index = this.clinicalNotes.findIndex(element => element.id === this.editable_object.id);
    this.clinicalNotes[index].value = notes;
    this.createRequestPayload();
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

  createRequestPayload() {

    const obj = this.clinicalNotes.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.value }), {});
    console.log('object..' + obj);

  }
}
