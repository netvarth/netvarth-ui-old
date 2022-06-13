import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { GeneralComponent } from '../general/general.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-clinicalnotes',
  templateUrl: './clinicalnotes.component.html',
  styleUrls: ['./clinicalnotes.component.css']
})
export class ClinicalnotesComponent implements OnInit, OnDestroy {

  @Input() showClinicalNotesDetails;
  @Input() changes;
  @Input() details;
  @Input() type;
  @Input() b_id;
  mrId = 0;
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
  clinical_constant = projectConstantsLocal.CLINICAL_NOTES;
  constructor(

    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor
  ) {


  }

  ngOnInit() {
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    this.mrId = parseInt(medicalrecordId, 0);

    if (this.mrId === 0 || this.mrId === undefined) {
      this.isLoaded = true;
      for (let i = 0; i < this.clinical_constant.length; i++) {
        this.clinical_constant[i].value = '';

      }
      this.clinicalNotes = this.clinical_constant;


    } else if (this.mrId !== 0) {
      for (let i = 0; i < this.clinical_constant.length; i++) {
        this.clinical_constant[i].value = '';

      }
      this.clinicalNotes = this.clinical_constant;
      this.getMRClinicalNotes(this.mrId).then((res: any) => {
        this.clinicalNotes = res;
        this.isLoaded = true;

      });
    }



  }

  ngOnChanges() {
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    this.mrId = parseInt(medicalrecordId, 0);

    if (this.mrId === 0 || this.mrId === undefined) {
      this.isLoaded = true;
      for (let i = 0; i < this.clinical_constant.length; i++) {
        this.clinical_constant[i].value = '';

      }
      this.clinicalNotes = this.clinical_constant;


    } else if (this.mrId !== 0) {
      for (let i = 0; i < this.clinical_constant.length; i++) {
        this.clinical_constant[i].value = '';

      }
      this.clinicalNotes = this.clinical_constant;
      this.getMRClinicalNotes(this.mrId).then((res: any) => {
        this.clinicalNotes = res;
        this.isLoaded = true;

      });
    }
  }

  getMRClinicalNotes(mrId) {
    const $this = this;
    let response = '';
    for (let i = 0; i < this.clinical_constant.length; i++) {
      this.clinical_constant[i].value = '';

    }
    const compArray = this.clinical_constant;

    return new Promise((resolve) => {
      $this.provider_services.getClinicalRecordOfMRById(mrId)
        .subscribe((res: any) => {
          if (res.clinicalNotes) {
            response = res.clinicalNotes;
          } else {
            response = res;
          }

          Object.entries(response).forEach(
            function ([key, v]) {
              const index = compArray.findIndex(element => element.id === key);
              compArray[index].value = v;

            });
        },
          error => {
            $this.snackbarService.openSnackBar($this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });


      resolve(compArray);
    });

  }

  ngOnDestroy() {

  }
  addOrEditClinicalNotes(object) {

    // const navigationExtras: NavigationExtras = {
    //   relativeTo: this.activatedRoute,
    //   queryParams: {
    //     'data': JSON.stringify(object),
    //     'clinicalNotes': JSON.stringify(this.clinicalNotes)
    //   }
    // };
    // this.router.navigate(['./edit'], navigationExtras);
    console.log('object', object);
    const dialogref = this.dialog.open(GeneralComponent, {
      width: '100%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'data': JSON.stringify(object),
        'clinicalNotes': JSON.stringify(this.clinicalNotes),
        'mrId': this.mrId,
        'details': this.details,
        'type': this.type,
        'uid': this.b_id
      }
    });
    dialogref.afterClosed().subscribe((data: any) =>
      console.log(data)
    );
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
