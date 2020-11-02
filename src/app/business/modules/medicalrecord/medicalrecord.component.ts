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

@Component({
  selector: 'app-medicalrecord',
  templateUrl: './medicalrecord.component.html',
  styleUrls: ['./medicalrecord.component.css']
})
export class MedicalrecordComponent implements OnInit {

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
  mrId: any;
  routeLinks: any[];
  activeLinkIndex = -1;
  userId;
  customerDetails: any;
  uuid: any;
  mrdialogRef: any;
  PatientId: any;
  gender: any;
  patientFirstName: any;
  patientLastName: number;
  PatientDob: any;
  mrlist;
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  mrCreatedDate: string;
  consultationMode = 'Out Patient';
  bookingType: any;
  patientConsultationType = 'OP';
  // patientConsultationModes: any = [{ 'name': 'OP' }, { 'name': 'PHONE' }, { 'name': 'EMAIL' }, { 'name': 'VIDEO' }];
  patientConsultationModes: any = [{ 'displayName': 'Out Patient', 'name': 'OP' }, { 'displayName': 'Phone', 'name': 'PHONE' }, { 'displayName': 'E-mail', 'name': 'EMAIL' }, { 'displayName': 'Tele-Service', 'name': 'VIDEO' }];

  visitTime = new Date().toLocaleTimeString();
  visitcount: any;
  selectedTab = 0;
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  back_type: any;
  logsdialogRef: any;
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog,
    private medicalService: MedicalrecordService,
    private datePipe: DateFormatPipe
  ) {
    this.visitdate = this.datePipe.transformToDateWithTime(new Date());
    this.routeLinks = [
      {
        label: 'Clinical Notes',
        link: '/provider/customers/medicalrecord/clinicalnotes',
        id: 'clinicalnotes',
        index: 0
      }, {
        label: 'Prescription',
        link: '/provider/customers/medicalrecord/prescription',
        id: 'prescription',
        index: 1
      }
    ];


    this.activated_route.queryParams.subscribe(
      (qparams) => {
        if (qparams['customerDetail']) {
          console.log(qparams);
          this.navigation_params = qparams;
          // tslint:disable-next-line:radix

          if (qparams.booking_date) {
            this.visitdate = qparams.booking_date;
          }
          if (qparams.back_type) {
            this.medicalService.setBacknav(qparams.back_type);
          }

          this.customerDetails = JSON.parse(qparams.customerDetail);
          if (this.customerDetails.memberJaldeeId) {
            this.display_PatientId = this.customerDetails.memberJaldeeId;
          } else if (this.customerDetails.jaldeeId) {
            this.display_PatientId = this.customerDetails.jaldeeId;
          }

          this.PatientId = this.customerDetails.id;
          if (qparams.department) {
            this.department = qparams.department;
          }
          if (qparams.serviceName) {
            this.serviceName = qparams.serviceName;
          }

          if (qparams.booking_type && qparams.booking_type === 'TOKEN' || 'APPT') {
            this.bookingType = qparams.booking_type;
            if (qparams.consultationMode) {
              this.consultationMode = qparams.consultationMode;
            }
          }


          if (qparams.mrId) {
            // tslint:disable-next-line:radix
            this.mrId = parseInt(qparams.mrId);
            this.medicalService.setCurrentMRID(this.mrId);
          }
          if (qparams.visitDate) {
            this.visitdate = qparams.visitDate;
          }
          if (qparams.booking_time) {
            this.visitTime = qparams.booking_time;
          }
          this.medicalService.setPatientDetailsForMR(qparams);


        } else {
          this.medicalService.patient_data.subscribe(res => {
            this.navigation_params = {
              'clone_params': res
            };


            this.customerDetails = JSON.parse(res.customerDetail);

            if (res.booking_date) {
              this.visitdate = res.booking_date;
            }
            this.PatientId = this.customerDetails.id;
            if (res.department) {
              this.department = res.department;
            }
            if (res.serviceName) {
              this.serviceName = res.serviceName;
            }



          });
          this.medicalService._mrUid.subscribe(mrId => {
            this.mrId = mrId;
          });


        }

      });

  }


  ngOnInit() {
    if (this.mrId !== 0) {
      this.getMedicalRecordUsingMR(this.mrId);
    }
    this.medicalService.back_nav.subscribe(res => {
      this.back_type = res;
    });

    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find(tab => tab.link === '.' + this.router.url));
    });
    this.getPatientVisitListCount();


  }
  getPatientVisitListCount() {
    if (this.PatientId !== null && this.PatientId !== undefined) {
      this.provider_services.getPatientVisitListCount(this.PatientId)
        .subscribe((data: any) => {
          this.visitcount = data;
          this.showLastvisitorNot();
        },
          error => {
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
  }
  modeChanged(event) {

    const object = {
      'consultationMode': event
    };
    if (this.mrId === 0) {

      this.medicalService.createMR('consultationMode', event).then(res => {
        this.getMedicalRecordUsingMR(res);
        this.navigation_params = { ...this.navigation_params, 'mrId': res };
        this.medicalService.setPatientDetailsForMR(this.navigation_params);
        this.medicalService.setCurrentMRID(res);

      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
    } else {
      this.updateMR(object, this.mrId);

    }
  }

  updateMR(payload, mrId) {
    this.provider_services.updateMR(payload, mrId)
      .subscribe((data) => {
        this.getMedicalRecordUsingMR(data);

        this.sharedfunctionObj.openSnackBar('Medical Record updated successfully');
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });


  }
  getMedicalRecordUsingMR(mrId) {


    this.provider_services.GetMedicalRecord(mrId)
      .subscribe((data: any) => {
        if (data) {
          console.log(data);
          console.log(data.mrNumber);
          this.mrNumber = data.mrNumber;
          this.mrCreatedDate = data.mrCreatedDate;
          if (this.data.consultationMode === 'Out Patient') {
            this.patientConsultationType = 'OP';

          } else {
            this.patientConsultationType = data.consultationMode.toUpperCase();
          }

        }
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  VisitList() {
    console.log(this.PatientId);
    this.mrdialogRef = this.dialog.open(LastVisitComponent, {
      width: '800px;',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        patientId: this.PatientId,
        customerDetail: this.customerDetails

      }
    });
    this.mrdialogRef.afterClosed().subscribe(result => {
      console.log(JSON.stringify(result));
      if (result.type === 'prescription') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], result.navigationParams);
      } else if (result.type === 'clinicalnotes') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['provider', 'customers', 'medicalrecord', 'clinicalnotes'], result.navigationParams);
      }
    });
  }
  activitylogs() {
    console.log(this.PatientId);
    this.logsdialogRef = this.dialog.open(ActivityLogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrId: this.mrId,
      }
    });

  }
  goback() {

    if (this.back_type === 'waitlist') {
      this.router.navigate(['provider', 'check-ins']);
    } else if (this.back_type === 'appt') {
      this.router.navigate(['provider', 'appointments']);
    } else if (this.back_type === 'consumer') {
      this.router.navigate(['provider', 'customers']);
    } else {
      this.router.navigate(['provider', 'customers']);
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
}
