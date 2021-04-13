import { Component, OnInit } from '@angular/core';
// import { MedicalrecordService } from '../medicalrecord.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MedicalrecordService } from '../medicalrecord.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

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
  patientid: any;

  department: any;
  serviceName: any;
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  navigationParams: any = {};
  navigationExtras: NavigationExtras;
  customer_label = '';
  constructor(
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
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


    this.activated_route.queryParams.subscribe(params => {
      this.editable_object = JSON.parse(params.data);
      this.edit_data = this.editable_object.value;
      this.displayTitle = this.editable_object.displayName;
      this.clinicalNotes = JSON.parse(params.clinicalNotes);

    });

  }

  ngOnInit() {
    this.activated_route.paramMap.subscribe(params => {
      this.patientId = params.get('id');
      this.bookingType = params.get('type');
      this.bookingId = params.get('uid');
      const medicalrecordId = params.get('mrId');
      this.mrId = parseInt(medicalrecordId, 0);
    });
  }

  redirecToClinicalNotes() {
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId]);

  }

  updateClinicalNotes(notes) {
    const index = this.clinicalNotes.findIndex(element => element.id === this.editable_object.id);
    console.log(index);

    this.clinicalNotes[index].value = notes;
    const payloadObject = this.clinicalNotes.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.value }), {});
    const payload = {
      'clinicalNotes': payloadObject
    };

    if (this.mrId === 0) {

      this.medicalrecordService.createMR('clinicalNotes', payloadObject).then(res => {
        this.mrId = res;
        this.snackbarService.openSnackBar('Medical Record Created Successfully');
        this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId]);
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
    } else {
      this.updateMrwithClinicalNotes(payload, this.mrId);

    }


  }

  updateMrwithClinicalNotes(payload, mrId) {
    this.provider_services.updateMrClinicalNOtes(payload, mrId)
      .subscribe((data) => {
        this.snackbarService.openSnackBar(this.displayTitle + ' updated successfully');
        this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId]);
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });


  }

}
