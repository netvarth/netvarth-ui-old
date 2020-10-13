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
  type: any;
  data: any;


  constructor(
    private medicalrecord_service: MedicalrecordService,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
  ) {
      this.activated_route.params.subscribe(params => {
      this.type = params.type;
      this.data = params.data;
      console.log(this.type);
      console.log(this.data);
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
    console.log(Cnotes);
  const post_itemdata = {
    'bookingType': 'NA',
    'consultationMode': 'EMAIL',
    'clinicalNotes': {
      'complaints': this.Cnotes || '',
      'symptoms' : this.Cnotes || '',
      'allergies'	: this.Cnotes || '',
      'vaccinationHistory': this.Cnotes || '',
      'observations': this.Cnotes || '',
      'diagnosis': this.Cnotes || '',
      'misc_notes': this.Cnotes || ''
    },
    'mrConsultationDate': this.today
  };
  console.log(post_itemdata, this.userId);
  this.provider_services.createMedicalRecord(post_itemdata, this.userId)
        .subscribe((data) => {
          console.log(data);
        },
            error => {
                this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
}
}
