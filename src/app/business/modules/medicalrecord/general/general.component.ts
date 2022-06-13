import { Component, Inject, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../services/provider-services.service';
import { NavigationExtras, Router } from '@angular/router';
import { MedicalrecordService } from '../medicalrecord.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  patientId: string;
  bookingId: string;
  bookingType: string;
  display_PatientId: any;
  paramObject: any;
  mrId: any;
  displayTitle: any;
  editable_object: any;
  clinicalNotes: any;
  edit_data = '';
  Cnotes: string;
  customerDetails: any;
  userId: any;
  today = new Date();
  department: any;
  serviceName: any;
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  navigationParams: any = {};
  navigationExtras: NavigationExtras;
  customer_label = '';
  patientDetails: any;
  constructor(
    public dialogref: MatDialogRef<GeneralComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    // private activated_route: ActivatedRoute,
    private router: Router,
    private medicalrecordService: MedicalrecordService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor
  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.customerDetails = this.medicalrecordService.getPatientDetails();
    if (this.customerDetails.memberJaldeeId) {
      this.display_PatientId = this.customerDetails.memberJaldeeId;
    } else if (this.customerDetails.jaldeeId) {
      this.display_PatientId = this.customerDetails.jaldeeId;
    }
    this.serviceName = this.medicalrecordService.getServiceName();
    this.department = this.medicalrecordService.getDepartmentName();
    // this.activated_route.queryParams.subscribe(params => {
    //   this.editable_object = JSON.parse(params.data);
    //   this.edit_data = this.editable_object.value;
    //   this.displayTitle = this.editable_object.displayName;
    //   this.clinicalNotes = JSON.parse(params.clinicalNotes);
    // });
    this.editable_object = JSON.parse(this.data.data);
    this.edit_data = this.editable_object.value;
    this.displayTitle = this.editable_object.displayName;
    this.clinicalNotes = JSON.parse(this.data.clinicalNotes);
  }
  ngOnInit() {

    // this.activated_route.paramMap.subscribe(params => {
    //   this.patientId = params.get('id');
    //   this.bookingType = params.get('type');
    //   this.bookingId = params.get('uid');
    //   const medicalrecordId = params.get('mrId');
    //   this.mrId = parseInt(medicalrecordId, 0);
    // });
    console.log("data", this.data)
    this.patientId = this.data.details.id;
    this.patientDetails = this.data.details;
    this.bookingType = this.data.type;
    this.bookingId = this.data.uid;
    const medicalrecordId = this.data.mrId
    this.mrId = parseInt(medicalrecordId, 0);
    console.log("this.patientDetails", this.patientDetails, this.bookingType, this.bookingId)
  }
  redirecToClinicalNotes() {
    this.dialogref.close();
    console.log('redirecToClinicalNotes successfully')

    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId]);
  }
  updateClinicalNotes(notes) {
    console.log("Entered into notes record")
    const index = this.clinicalNotes.findIndex(element => element.id === this.editable_object.id);
    console.log(index);
    this.clinicalNotes[index].value = notes;
    const payloadObject = this.clinicalNotes.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.value }), {});
    const payload = {
      'clinicalNotes': payloadObject
    };
    if (this.mrId === 0) {
      console.log("Entered into medical record")
      this.medicalrecordService.createMR('clinicalNotes', payloadObject).then(res => {
        this.mrId = res;
        this.snackbarService.openSnackBar('Medical Record Created Successfully');
        this.dialogref.close(this.mrId)
        this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId])

      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
    } else {
      console.log("Entered into else record")
      this.updateMrwithClinicalNotes(payload, this.mrId);
    }
  }
  updateMrwithClinicalNotes(payload, mrId) {
    this.provider_services.updateMrClinicalNOtes(payload, mrId)
      .subscribe((data) => {
        this.snackbarService.openSnackBar(this.displayTitle + ' updated successfully');
        this.dialogref.close(mrId)
        console.log('updated successfully')
        console.log(' this.patientId', this.display_PatientId)
        this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId]).then(() => {
          console.log("navigation true")
          this.ngOnInit()
        });
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
}
