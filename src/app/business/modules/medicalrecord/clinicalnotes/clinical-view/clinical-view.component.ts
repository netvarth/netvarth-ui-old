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


  clinicalNotes: { displayName: string; value: string; id: string; }[];
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
      if (mrId !== 0) {
        this.getMRClinicalNotes(mrId).then((res: any) => {
          this.clinicalNotes = res;
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
    console.log('inideeeeeeeeeeeee');
    const p_clinicalNotes = projectConstantsLocal.CLINICAL_NOTES;
    return new Promise((resolve) => {
      this.provider_services.getClinicalRecordOfMRById(mrId)
        .subscribe(res => {

          Object.entries(res).forEach(
            function (key, value) {
              const index = p_clinicalNotes.findIndex(element => element.id === key.toString());
              p_clinicalNotes[index.toString()].value = value;
            });
        },
          error => {
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
      resolve(p_clinicalNotes);
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
