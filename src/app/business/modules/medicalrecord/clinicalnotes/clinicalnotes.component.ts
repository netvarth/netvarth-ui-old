import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Router, NavigationExtras } from '@angular/router';
import { MedicalrecordService } from '../medicalrecord.service';


@Component({
  selector: 'app-clinicalnotes',
  templateUrl: './clinicalnotes.component.html',
  styleUrls: ['./clinicalnotes.component.css']
})
export class ClinicalnotesComponent implements OnInit {

  mrId: any;
  clinicalNotes: any[];
  allergies: any;
  currentMRId: any;
  patientDetails: any;
  userId;
  customerDetails: any;
  editclinicaldialogRef: any;
  symptoms: any;
  diagnosis: any;
  complaints: any;
  observations: any;
  misc_notes: any;
  vaccinationHistory: any;
  Cdata;
  isLoaded = false;
  constructor(

    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private router: Router,
    private medicalrecordService: MedicalrecordService) {

    this.medicalrecordService._mrUid.subscribe(mrId => {
      this.mrId = mrId;
    });

  }

  ngOnInit() {


    if (this.mrId === 0 || this.mrId === undefined) {
      this.isLoaded = true;
      this.clinicalNotes = projectConstantsLocal.CLINICAL_NOTES;

    } else {
      this.getMRClinicalNotes(this.mrId).then((res: any) => {
        this.clinicalNotes = res;
        console.log(JSON.stringify(this.clinicalNotes));

        this.isLoaded = true;

      });
    }

}



getMRClinicalNotes(mrId) {
  const _this = this;
  _this.clinicalNotes = projectConstantsLocal.CLINICAL_NOTES;

  return new Promise((resolve) => {
    _this.provider_services.getClinicalRecordOfMRById(mrId)
      .subscribe((res: any) => {
        const response = res.clinicalNotes;
        Object.entries(response).forEach(
          function ([key, v]) {
            const index = _this.clinicalNotes.findIndex(element => element.id === key);
            _this.clinicalNotes[index].value = v;

          });
      },
        error => {
          _this.sharedfunctionObj.openSnackBar(_this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });


    resolve(_this.clinicalNotes);
  });

}
addOrEditClinicalNotes(object) {

  const navigationExtras: NavigationExtras = {
    queryParams: {
      'data': JSON.stringify(object),
      'clinicalNotes': JSON.stringify(this.clinicalNotes)
    }
  };
  this.router.navigate(['/provider/medicalrecord/edit'], navigationExtras);
}
}
