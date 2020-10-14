import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { MedicalrecordService } from '../../medicalrecord.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-clinical-view',
  templateUrl: './clinical-view.component.html',
  styleUrls: ['./clinical-view.component.css']
})
export class ClinicalViewComponent implements OnInit {


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
      console.log(mrId);

      if (mrId !== 0) {
        this.getMRClinicalNotes(mrId).then((res: any) => {
          this.clinicalNotes = res;
          console.log(JSON.stringify(this.clinicalNotes));
          this.isLoaded = true;

        });
      } else {
        this.clinicalNotes = projectConstantsLocal.CLINICAL_NOTES;
      }
    });
  }

  ngOnInit() {

  }


  getMRClinicalNotes(mrId) {
    const _this = this;
    _this.clinicalNotes = projectConstantsLocal.CLINICAL_NOTES;
    console.log(JSON.stringify(_this.clinicalNotes) + 'helooooo');


    return new Promise((resolve) => {
      _this.provider_services.getClinicalRecordOfMRById(mrId)
        .subscribe(res => {
          console.log(res);
          Object.entries(res).forEach(
            function ([key, v]) {
              console.log(v);
              console.log(_this.clinicalNotes.findIndex(element => element.id === key));

              const index = _this.clinicalNotes.findIndex(element => element.id === key);
              _this.clinicalNotes[index].value = v;
              console.log('afterupdating ...' + _this.clinicalNotes[index].value);

            });
        },
          error => {
            _this.sharedfunctionObj.openSnackBar(_this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
      console.log('final..' + JSON.stringify(_this.clinicalNotes));

      resolve(_this.clinicalNotes);
    });

  }
  addOrEditClinicalNotes(object) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'data': object,
        'clinicalNotes': this.clinicalNotes
      }
    };
    console.log(navigationExtras);

    this.router.navigate(['/provider/medicalrecord/home/clinicalnotes/edit'], navigationExtras);
  }
}
