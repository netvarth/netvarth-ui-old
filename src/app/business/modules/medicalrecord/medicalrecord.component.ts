import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { LastVisitComponent } from './last-visit/last-visit.component';
import { MedicalrecordService } from './medicalrecord.service';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { Location } from '@angular/common';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';

@Component({
  selector: 'app-medicalrecord',
  templateUrl: './medicalrecord.component.html',
  styleUrls: ['./medicalrecord.component.css']
})
export class MedicalrecordComponent implements OnInit {

  accountType: any;
  bookingId: string;
  patientId: string;
  activityLogs: any;
  mrNumber: any;
  visitdate: Date;
  isShowList = false;
  dateShow = true;
  isShow: boolean;
  showVisits = false;
  display_PatientId: any;
  navigation_params: { [key: string]: any; };
  mrDate: Date;
  serviceName = 'Consultation';
  department: any;
  data: any;
  mrId = 0;
  routeLinks: any[];
  activeLinkIndex = -1;
  userId;
  customerDetails: any;
  uuid: any;
  mrdialogRef: any;
  gender: any;
  patientFirstName: any;
  patientLastName: number;
  PatientDob: any;
  mrlist;
  providerId;
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;

  mrCreatedDate: string;
  consultationMode = 'Out Patient';
  bookingType: any;
  patientConsultationType = 'OP';
  patientConsultationModes: any = [{ 'displayName': 'Out Patient', 'name': 'OP' }, { 'displayName': 'Phone', 'name': 'PHONE' }, { 'displayName': 'E-mail', 'name': 'EMAIL' }, { 'displayName': 'Tele-Service', 'name': 'VIDEO' }];

  visitTime = new Date().toLocaleTimeString();
  visitcount: any;
  selectedTab = 0;
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  back_type: any;
  logsdialogRef: any;
  loading = true;
  doctorName;
  customer_label = '';
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog, private location: Location,
    private medicalService: MedicalrecordService,
    private datePipe: DateFormatPipe,
    private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private groupService: GroupStorageService
  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.visitdate = this.datePipe.transformToDateWithTime(new Date());
    this.activated_route.queryParams.subscribe(queryParams => {
      if (queryParams['calledfrom']) {
        this.medicalService.setCalledFrom(queryParams['calledfrom']);
      }


    });


  }


  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    this.medicalService.setDoctorId(user.id);
    this.activated_route.paramMap.subscribe(params => {
      this.patientId = params.get('id');
      this.bookingType = params.get('type');
      this.bookingId = params.get('uid');
      const medicalrecordId = params.get('mrId');
      this.mrId = parseInt(medicalrecordId, 0);
      this.medicalService.setParams(this.bookingType, this.bookingId);
      this.getPatientVisitListCount();

      if (this.mrId !== 0) {
        this.getMedicalRecordUsingId(this.mrId);
      } else {
        if (this.bookingType === 'APPT') {
          this.getAppointmentById(this.bookingId);
        } else if (this.bookingType === 'TOKEN') {
          this.getWaitlistDetails(this.bookingId);
        } else if (this.bookingType === 'FOLLOWUP') {
          this.getPatientDetails(this.patientId);
        }
      }
      const clinical_link = '/provider/customers/' + this.patientId + '/' + this.bookingType + '/' + this.bookingId + '/medicalrecord/' + this.mrId + '/clinicalnotes';
      const prescription_link = '/provider/customers/' + this.patientId + '/' + this.bookingType + '/' + this.bookingId + '/medicalrecord/' + this.mrId + '/prescription';
      this.routeLinks = [
        {
          label: 'Clinical Notes',
          link: clinical_link,
          id: 'clinicalnotes',
          index: 0
        }, {
          label: 'Prescription',
          link: prescription_link,
          id: 'prescription',
          index: 1
        }

      ];

    });


  }
  getAppointmentById(uid) {
    this.provider_services.getAppointmentById(uid)
      .subscribe((data: any) => {
        const response = data;
        this.loading = false;
        this.visitdate = response.consLastVisitedDate;

        if (response.department) {
          this.department = response.service.department;
        } if (response.service) {
          this.serviceName = response.service.name;
        }
        this.medicalService.setServiceDept(this.serviceName, this.department);
        this.customerDetails = response.appmtFor[0];
        this.medicalService.setPatientDetails(this.customerDetails);
        this.patientId = this.customerDetails.id;
        if (this.customerDetails.memberJaldeeId) {
          this.display_PatientId = this.customerDetails.memberJaldeeId;
        } else if (this.customerDetails.jaldeeId) {
          this.display_PatientId = this.customerDetails.jaldeeId;
        }
        if (response.provider && response.provider.id) {
          this.doctorName = response.provider.firstName + ' ' + response.provider.lastName;
          this.medicalService.setDoctorId(response.provider.id);
        }

      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getWaitlistDetails(uid) {
    this.provider_services.getProviderWaitlistDetailById(uid)
      .subscribe((data: any) => {
        const response = data;
        this.loading = false;
        this.visitdate = response.consLastVisitedDate;
        if (response.department) {
          this.department = response.service.department;
        } if (response.service) {
          this.serviceName = response.service.name;
        }
        this.medicalService.setServiceDept(this.serviceName, this.department);
        this.customerDetails = response.waitlistingFor[0];
        this.medicalService.setPatientDetails(this.customerDetails);
        this.patientId = this.customerDetails.id;
        if (this.customerDetails.memberJaldeeId) {
          this.display_PatientId = this.customerDetails.memberJaldeeId;
        } else if (this.customerDetails.jaldeeId) {
          this.display_PatientId = this.customerDetails.jaldeeId;
        }
        if (response.provider && response.provider.id) {
          this.doctorName = response.provider.firstName + ' ' + response.provider.lastName;
          this.medicalService.setDoctorId(response.provider.id);
        }

      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getPatientDetails(uid) {

    const filter = { 'id-eq': uid };
    this.provider_services.getCustomer(filter)
      .subscribe(
        (data: any) => {
          const response = data;
          this.loading = false;
          this.customerDetails = response[0];
          this.patientId = this.customerDetails.id;
          if (this.customerDetails.memberJaldeeId) {
            this.display_PatientId = this.customerDetails.memberJaldeeId;
          } else if (this.customerDetails.jaldeeId) {
            this.display_PatientId = this.customerDetails.jaldeeId;
          }
          this.medicalService.setPatientDetails(this.customerDetails);


        },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  routerNavigate(event, routerId) {
    console.log(event);
    event.target.classList.add('mat-tab-link-active');
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, routerId]);

  }


  getPatientVisitListCount() {
    if (this.patientId !== null && this.patientId !== undefined) {
      this.provider_services.getPatientVisitListCount(this.patientId)
        .subscribe((data: any) => {
          this.visitcount = data;
          this.showLastvisitorNot();
        },
          error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
  }
  modeChanged(event) {

    const object = {
      'consultationMode': event
    };
    if (this.mrId === 0) {

      this.medicalService.createMR('consultationMode', event).then(res => {
        this.getMedicalRecordUsingId(res);

      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
    } else {
      this.updateMR(object, this.mrId);

    }
  }

  updateMR(payload, mrId) {
    this.provider_services.updateMR(payload, mrId)
      .subscribe((data) => {
        this.getMedicalRecordUsingId(data);

        this.snackbarService.openSnackBar('Medical Record updated successfully');
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });


  }
  getMedicalRecordUsingId(mrId) {
    console.log('mrId' + mrId);

    this.provider_services.GetMedicalRecord(mrId)
      .subscribe((data: any) => {
        if (data) {
          this.loading = false;
          this.mrNumber = data.mrNumber;
          this.mrCreatedDate = data.mrCreatedDate;
          this.activityLogs = data.auditLogs;
          this.visitdate = data.mrConsultationDate;
          if (data.department) {
            this.department = data.service.department;
          } if (data.service) {
            this.serviceName = data.service.name;
          }
          this.medicalService.setServiceDept(this.serviceName, this.department);
          this.customerDetails = data.providerConsumer;
          this.medicalService.setPatientDetails(this.customerDetails);
          this.patientId = this.customerDetails.id;
          if (this.customerDetails.memberJaldeeId) {
            this.display_PatientId = this.customerDetails.memberJaldeeId;
          } else if (this.customerDetails.jaldeeId) {
            this.display_PatientId = this.customerDetails.jaldeeId;
          }
          if (data.provider && data.provider.id) {
            this.doctorName = data.provider.firstName + ' ' + data.provider.lastName;
            this.medicalService.setDoctorId(data.provider.id);
          }
          if (this.data.consultationMode === 'Out Patient') {
            this.patientConsultationType = 'OP';

          } else {
            this.patientConsultationType = data.consultationMode.toUpperCase();
          }


        }
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  VisitList() {
    console.log(this.patientId);
    this.mrdialogRef = this.dialog.open(LastVisitComponent, {
      width: '800px;',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        patientId: this.patientId,
        customerDetail: this.customerDetails

      }
    });
    this.mrdialogRef.afterClosed().subscribe(result => {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 100);
    });
  }
  activitylogs() {
    console.log(this.patientId);
    this.logsdialogRef = this.dialog.open(ActivityLogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'activity_log': this.activityLogs,
        'mrId': this.mrId
      }
    });

  }
  goback() {
    const back_type = this.medicalService.getReturnTo();
    if (back_type === 'waitlist') {
      this.router.navigate(['provider', 'check-ins']);
    } else if (back_type === 'appt') {
      this.router.navigate(['provider', 'appointments']);
    } else if (back_type === 'patient') {
      this.router.navigate(['provider', 'customers']);
    } else if (back_type === 'list') {
      this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'list']);
    } else {
      this.location.back();
    }
  }
  showLastvisitorNot() {

    switch (this.bookingType) {
      case 'FOLLOWUP': {
        if (this.visitcount > 0) {
          this.isShowList = true;
          this.dateShow = false;
        } else if (this.visitcount === 0) {
          this.dateShow = true;
          this.isShowList = false;
        }
        break;
      }
      case 'APPT': {
        if (this.visitcount > 1) {
          this.isShowList = true;
          this.dateShow = false;
        } else if (this.visitcount <= 1) {
          this.dateShow = true;
          this.isShowList = false;
        }
        break;

      }
      case 'TOKEN': {
        if (this.visitcount > 1) {
          this.dateShow = false;
          this.isShowList = true;
        } else if (this.visitcount <= 1) {
          this.dateShow = true;
          this.isShowList = false;
        }
        break;

      }
    }


  }
  uploadFileforMr(){
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'fileupload']);
  }
  
}

