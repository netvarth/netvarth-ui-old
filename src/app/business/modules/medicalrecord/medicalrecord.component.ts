import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';
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
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
// import { MrfileuploadpopupComponent } from './uploadfile/mrfileuploadpopup/mrfileuploadpopup.component';
import { MatTableDataSource } from '@angular/material/table';
import { UploadFileComponent } from './uploadfile/uploadfile.component';
import { FileService } from '../../../shared/services/file-service';
import { PreviewpdfComponent } from '../crm/leads/view-lead-qnr/previewpdf/previewpdf.component';
import { ConfirmBoxComponent } from '../../shared/confirm-box/confirm-box.component';
import { SubSink } from 'subsink';
import { UploadPrescriptionComponent } from './prescription/upload-prescription/upload-prescription.component';
import { PrescriptionSelectComponent } from './prescription/prescription-select/prescription-select.component';



@Component({
  selector: 'app-medicalrecord',
  templateUrl: './medicalrecord.component.html',
  styleUrls: ['./medicalrecord.component.css']
})
export class MedicalrecordComponent implements OnInit {
  public lastVisit_dataSource = new MatTableDataSource<any>([]);
  previousLIst: any;
  lastVisit_displayedColumns = ['consultationDate', 'mrId', 'serviceName', 'userName', 'mr'];
  accountType: any;
  bookingId: any;
  patientId: any;
  activityLogs: any;
  mrNumber: any;
  visitdate: Date;
  drugList: any;
  selectPrescriptiondialogRef: any;
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

  mrCreatedDate: any;
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
  doctorBName;
  doctorName;
  customer_label = '';
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  uploadFiles: any = [];
  image_list_popup: Image[];
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };
  upload_status = 'Uploaded';
  removemrfileuploaddialogRef;
  showtable = false;
  uploadfiledialogRef;
  orderstatus: any;
  loading_table: boolean;
  viewVisitDetails: boolean = this.medicalService.viewVisitDetails;
  someSubscription: any;
  uploadedfiledialogRef: any;
  provider: string;
  customerphoneno: any;
  medicalRecordBtnName: string = 'Create';
  mrDateFromTableRow: any;
  showHidepreviousDetails: boolean;
  showHideAddPrescription: boolean;
  showHideClinicalNotes: boolean;
  medicalRecordID: any;
  private subscriptions = new SubSink();
  mRListUsingId: any;
  showHideActivityTYpe: boolean = false;
  prescriptionOuter: boolean = true;
  clinicalOuter: boolean = true;
  medicalInfo: any;
  tempClinicalNOtes: boolean = false;
  tempPrescription: boolean = false;
  visitDetailsTableValue: any;
  tempText: any;
  creteTypeMr: any;
  calledForm: string;
  customerDetailsAge: any;
  tempPhoneNumber: any;
  suggestions: any = [];
  small_device_display = false;
  mrecordId: any;
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog, private location: Location,
    private medicalService: MedicalrecordService,
    private datePipe: DateFormatPipe,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private fileService: FileService,
  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.visitdate = this.datePipe.transformToDateWithTime(new Date());
    this.activated_route.queryParams.subscribe(queryParams => {
      console.log('queryParamsCalledFrom', queryParams)
      if (queryParams['calledfrom']) {
        this.calledForm = queryParams['calledfrom']//this.medicalService.setCalledFrom(queryParams['calledfrom']);
      }
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.someSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Here is the dashing line comes in the picture.
        // You need to tell the router that, you didn't visit or load the page previously, so mark the navigated flag to false as below.
        this.router.navigated = false;
      }
    });
  }
  ngOnInit(): void {
    this.onResize();
    // console.log('tempClinicalNOtes::',this.tempClinicalNOtes)
    const uniqueId = this.groupService.getitemFromGroupStorage('uniqueId');
    this.provider_services.getClinicalSuggestions(uniqueId).subscribe(
      (suggestions: any) => {
        this.suggestions = suggestions;
      }
    );
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    this.provider = user.userName
    this.medicalService.setDoctorId(user.id);
    this.activated_route.paramMap.subscribe(params => {
      // console.log('params',params)
      this.patientId = params.get('id');
      this.bookingType = params.get('type');
      this.bookingId = params.get('uid');
      const medicalrecordId = params.get('mrId');
      this.mrId = parseInt(medicalrecordId, 0);
      this.medicalService.setParams(this.bookingType, this.bookingId);
      this.getPatientVisitListCount();
      // console.log('visitDetailsTableValue',this.visitDetailsTableValue)
      this.getPatientVisitList();
      // console.log('this.mrId',this.mrId)
      if (this.mrId !== 0) {
        this.getMedicalRecordUsingId(this.mrId);
      } else {
        if (this.bookingType === 'APPT') {
          this.getPatientDetails(this.patientId);
          this.getAppointmentById(this.bookingId);
        } else if (this.bookingType === 'TOKEN') {
          this.getPatientDetails(this.patientId);
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
    // console.log("viewVisitDetails :", this.medicalService.viewVisitDetails)
    this.activated_route.queryParams.subscribe((res) => {
      // console.log('res',res);
      this.creteTypeMr = res;
    })

  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }

  ngOnDestroy() {
    if (this.someSubscription) {
      this.someSubscription.unsubscribe();
    }
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
        if (response && response.appmtFor && response.appmtFor[0]) {
          this.customerDetails = response.appmtFor[0];
        }
        // console.log('customerDetailsappmtFor::',  this.customerDetails)
        this.medicalService.setPatientDetails(this.customerDetails);
        this.patientId = this.customerDetails.id;
        if (this.customerDetails.memberJaldeeId) {
          this.display_PatientId = this.customerDetails.memberJaldeeId;
        } else if (this.customerDetails.jaldeeId) {
          this.display_PatientId = this.customerDetails.jaldeeId;
        }
        if (response.provider && response.provider.id) {
          this.doctorName = response.provider.firstName + ' ' + response.provider.lastName;
          this.doctorBName = response.provider.businessName;
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
        if (response && response.waitlistingFor && response.waitlistingFor[0]) {
          this.customerDetails = response.waitlistingFor[0];
        }
        // console.log('customerDetailswaitlistingFor::',  this.customerDetails)
        this.medicalService.setPatientDetails(this.customerDetails);
        this.patientId = this.customerDetails.id;
        if (this.customerDetails.memberJaldeeId) {
          this.display_PatientId = this.customerDetails.memberJaldeeId;
        } else if (this.customerDetails.jaldeeId) {
          this.display_PatientId = this.customerDetails.jaldeeId;
        }
        if (response.provider && response.provider.id) {
          this.doctorBName = response.provider.businessName;
          this.doctorName = response.provider.firstName + ' ' + response.provider.lastName;
          this.medicalService.setDoctorId(response.provider.id);
        }

      },
        error => {
          // alert('getWaitlistDetails')
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getPatientDetails(uid) {
    const filter = { 'id-eq': uid };
    this.subscriptions.sink = this.provider_services.getCustomer(filter)
      .subscribe(
        (data: any) => {
          const response = data;
          this.loading = false;
          console.log('responseToken', response);
          if (response && response[0]) {
            this.customerDetails = response[0];
          }
          // console.log('customerDetailPatientDetails::',  this.customerDetails);
          if (this.customerDetails) {
            if (this.customerDetails.phoneNo) {
              this.tempPhoneNumber = this.customerDetails.phoneNo;
            }
            if (this.customerDetails.age && this.customerDetails.age.year) {
              this.customerDetailsAge = this.customerDetails.age.year
            }
            if (this.customerDetails.id) {
              this.patientId = this.customerDetails.id;

            }
          }
          if (this.customerDetails && this.customerDetails.memberJaldeeId) {
            this.display_PatientId = this.customerDetails.memberJaldeeId;
          } else if (this.customerDetails && this.customerDetails.jaldeeId) {
            this.display_PatientId = this.customerDetails.jaldeeId;
          }
          this.medicalService.setPatientDetails(this.customerDetails);
        },
        error => {
          // alert('getPatientDetails')
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  routerNavigate(event, routerId) {
    event.target.classList.add('mat-tab-link-active');
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, routerId]);

  }

  getPatientVisitList(hide?: any, text?: any) {
    if (hide === false && text) {
      if (text === 'createPrescription') {
        this.showHidepreviousDetails = false;
        this.showHideAddPrescription = true;
        this.showHideClinicalNotes = false;
      }
      else {
        this.showHidepreviousDetails = false;
        this.showHideAddPrescription = false;
        this.showHideClinicalNotes = true;
      }
      return hide;
    }
    else if ((hide === undefined)) {
      this.provider_services.getPatientVisitList(this.patientId)
        .subscribe((data: any) => {
          this.loading_table = false;
          this.lastVisit_dataSource = data;
          console.log('lastVisit_dataSource::', this.lastVisit_dataSource);
          this.previousLIst = data;
          const arrUniq = [...new Map(this.previousLIst.slice().reverse().map(v => [v.id, v])).values()].reverse();
          console.log('arrUniq', arrUniq)
          if (this.mrId === 0) {
            let num = Number(this.bookingId)
            if (num === 0) {
              this.showHidepreviousDetails = true;
              this.loading_table = true;
            }
            else {
              if (this.creteTypeMr.prescription === 'prescription') {
                this.showHidepreviousDetails = false;
                this.showHideAddPrescription = true;
                this.prescriptionOuter = false;
                this.clinicalOuter = false
              }

              else if (this.creteTypeMr.clinicalnotes === 'clinicalnotes') {
                this.showHidepreviousDetails = false;
                this.showHideClinicalNotes = true;
                this.prescriptionOuter = false;
                this.clinicalOuter = false
              }
              else if (this.creteTypeMr.calledfrom === 'appt') {
                this.showHidepreviousDetails = true;
                this.loading_table = true;
              }
              else if (this.creteTypeMr.calledfrom === 'waitlist') {
                this.showHidepreviousDetails = true;
                this.loading_table = true;
              }
              else {
                this.showHidepreviousDetails = true;
                this.loading_table = true;
              }
            }
          }
          else {
            this.viewVisitDetails = true;
          }
          this.loading_table = false;
        },
          error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });



    }

  }

  getPatientVisitListCount() {
    if (this.patientId !== null && this.patientId !== undefined) {
      this.provider_services.getPatientVisitListCount(this.patientId)
        .subscribe((data: any) => {
          this.visitcount = data;
          this.showLastvisitorNot();
          this.loading_table = true;
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

        this.snackbarService.openSnackBar('Medical Record update successfully');
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });


  }




  getMedicalRecordUsingId(mrId) {
    this.subscriptions.sink = this.provider_services.GetMedicalRecord(mrId)
      .subscribe((data: any) => {
        if (data) {
          this.loading = false;
          this.medicalInfo = data;
          this.mrNumber = data.mrNumber;
          if (data.prescriptions && data.prescriptions.prescriptionsList && data.prescriptions.prescriptionsList.length) {
            this.mRListUsingId = data.prescriptions.prescriptionsList.length;
            // console.log('this.mRListUsingId:::',this.mRListUsingId)
          }
          if (data.mrCreatedDate) {
            this.mrCreatedDate = data.mrCreatedDate;
          }
          this.activityLogs = data.auditLogs;
          if (data.mrConsultationDate) {
            this.visitdate = data.mrConsultationDate;
          }
          if (data.mrVideoAudio) {
            this.uploadFiles = data.mrVideoAudio;
          }
          if (data.department) {
            this.department = data.service.department;
          } if (data.service) {
            this.serviceName = data.service.name;
          }
          this.medicalService.setServiceDept(this.serviceName, this.department);
          this.customerDetails = data.providerConsumer;
          // console.log('customerDetailMedicalRecordUsingId::',  this.customerDetails)
          this.medicalService.setPatientDetails(this.customerDetails);
          this.patientId = this.customerDetails.id;
          if (this.customerDetails.memberJaldeeId) {
            this.display_PatientId = this.customerDetails.memberJaldeeId;
          } else if (this.customerDetails.jaldeeId) {
            this.display_PatientId = this.customerDetails.jaldeeId;
          }
          if (data.provider && data.provider.id) {
            this.doctorName = data.provider.firstName + ' ' + data.provider.lastName;
            this.doctorBName = data.provider.businessName;
            this.medicalService.setDoctorId(data.provider.id);
          }
          if (data.consultationMode === 'Out Patient') {
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



  prescriptionSelect(patientId) {
    this.selectPrescriptiondialogRef = this.dialog.open(PrescriptionSelectComponent, {
      width: '500px;',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        patientId: this.patientId,
        customerDetail: this.customerDetails

      }
    });
    this.selectPrescriptiondialogRef.afterClosed().subscribe(result => {
      if (result && result.type == 'createnew') {
        this.addPrescriptionAndClinical(patientId, 'createPrescription')
      }
      else if (result && result.type == 'templateselected') {
        this.provider_services.getTemplateById(result.id).subscribe((fetchedData) => {
          if (fetchedData) {
            this.drugList = fetchedData;
            if (this.drugList) {
              console.log("done")
              this.addPrescriptionAndClinical(patientId, 'createPrescription')
            }
          }
        })
      }
    });
  }


  activitylogs() {
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
  goback(type_from) {
    this.getCustomerbyId(this.customerDetails.id)
    const back_type = this.medicalService.getReturnTo();
    // console.log('back_type',back_type)
    // console.log('type_from',type_from)
    if (type_from === 'medical') {
      // alert(type_from)
      this.medicalService.viewVisitDetails = false;
      this.viewVisitDetails = false;
      // console.log('this.medicalInfo',this.medicalInfo);
      // console.log('visitDetailsTableValue',this.visitDetailsTableValue)
      this.location.back();
    }
    else {
      // alert(back_type)
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
  // uploadedFileforMr() {
  //   const mrId = this.mrId;
  //   this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', mrId, 'fileupload']);
  // }


  getCustomerbyId(id) {
    const filter = { 'id-eq': id };
    this.provider_services.getCustomer(filter)
      .subscribe(
        (data: any) => {
          if (this.data && this.data[0] && this.data[0].phoneNo) {
            this.customerphoneno = this.data[0].phoneNo;
          }
        });
    return this.customerphoneno;
  }


  isShowtable() {
    if (this.showtable === false) {
      this.showtable = true;
    } else {
      this.showtable = false;
    }
  }
  uploadFileforMr() {

    if (this.small_device_display) {

      this.uploadfiledialogRef = this.dialog.open(UploadPrescriptionComponent, {
        width: '100%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          mrid: this.mrId,
          patientid: this.patientId,
          bookingid: this.bookingId,
          bookingtype: this.bookingType
        }
      });
      this.uploadfiledialogRef.afterClosed().subscribe(result => {
        // console.log(result)
        if (result) {
          this.getMedicalRecordUsingId(result);
        }
      });
    }
    else {

      this.uploadfiledialogRef = this.dialog.open(UploadPrescriptionComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          mrid: this.mrId,
          patientid: this.patientId,
          bookingid: this.bookingId,
          bookingtype: this.bookingType
        }
      });
      this.uploadfiledialogRef.afterClosed().subscribe(result => {
        // console.log(result)
        if (result) {
          this.getMedicalRecordUsingId(result);
        }
      });
    }

  }








  uploadedFileforMr() {
    this.uploadedfiledialogRef = this.dialog.open(UploadFileComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrid: this.mrId,
        patientid: this.patientId,
        bookingid: this.bookingId,
        bookingtype: this.bookingType
      }
    });
    this.uploadedfiledialogRef.afterClosed().subscribe(result => {
      // console.log(result)
      if (result) {
        this.getMedicalRecordUsingId(result);
      }
    });
  }






  getLastVisitDate(visit) {
    // console.log('visitDate::',visit)
    let visitdate = '';
    if (visit.waitlist) {
      visitdate = visit.waitlist.consLastVisitedDate;
    } else if (visit.appointmnet) {
      visitdate = visit.appointmnet.consLastVisitedDate;
    } else {
      visitdate = visit.consLastVisitedDate;
    }
    return visitdate;
  }
  isMRCreated(visit) {
    // console.log('visit-medicalRecordBtnName::::',visit)
    let mrCreated = false;
    if (visit.mrCreated) {
      this.medicalRecordBtnName = 'Create'
      mrCreated = visit.mrCreated;
    }
    else {
      this.medicalRecordBtnName = 'View'
    }
    return mrCreated;

  }
  isRxCreated(visit) {
    let rxCreated = false;
    if (visit.prescriptionCreated) {
      rxCreated = visit.prescriptionCreated;
    }
    return rxCreated;

  }
  getServiceName(visit) {
    let serviceName = 'Consultation';
    if (visit.waitlist) {
      serviceName = visit.waitlist.service.name;
    } else if (visit.appointmnet) {
      serviceName = visit.appointmnet.service.name;
    }
    return serviceName;

  }
  getDate(mrCreatedDate) {
    if (typeof mrCreatedDate === 'string') {
      const dateCreated = mrCreatedDate.split(' ');
      if (dateCreated && dateCreated[0]) {
        return dateCreated[0];
      }
    }
    else {
      return mrCreatedDate;
    }
    // const created = new Date(dateCreated)
    // const created = this.datePipe.transform(dateCreated, 'yyyy-MM-ddTHH:mm');
    // const mrDate = new Date(dateCreated[0])
    // const formattedDate = mrDate.getFullYear() + "-" + (mrDate.getMonth() + 1) + "-" + mrDate.getDate()
    // console.log("typeof(dateCreated)", typeof (mrDate))
  }
  getMedicalRecord(visitDetails) {
    // console.log('visitDetails:::',visitDetails)
    this.visitDetailsTableValue = visitDetails;
    // this.selectedRowIndex = visitDetails.mrId;
    if (visitDetails.waitlist) {
      // alert('1')
      // showHideActivityTYpe
      if (visitDetails.mrCreated) {
        this.showHideActivityTYpe = false;
        this.clinicalOuter = true;
        this.prescriptionOuter = true;
        let mrId = 0;
        if (visitDetails.waitlist.mrId) {
          mrId = visitDetails.waitlist.mrId;
        }
        if (visitDetails && visitDetails.waitlist && visitDetails.waitlist.waitlistingFor && visitDetails.waitlist.waitlistingFor[0]) {
          const customerDetails = visitDetails.waitlist.waitlistingFor[0];
          // console.log('customerDetailgetMedicalRecord::', this.customerDetails)
          const customerId = customerDetails.id;
          const bookingId = visitDetails.waitlist.ynwUuid;
          const bookingType = 'TOKEN';
          this.medicalService.viewVisitDetails = true;
          this.viewVisitDetails = this.medicalService.viewVisitDetails
          // console.log(this.medicalService.viewVisitDetails)
          this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription']);
        }

      }
      else {
        // alert('token')
        this.showHideActivityTYpe = true;
        this.showHidepreviousDetails = false;
        this.clinicalOuter = false;
        this.prescriptionOuter = false;
        this.medicalService.viewVisitDetails = false;
      }
    }
    else if (visitDetails.appointmnet) {
      // alert('2')
      if (visitDetails.mrCreated) {
        let mrId = 0;
        if (visitDetails.appointmnet.mrId) {
          mrId = visitDetails.appointmnet.mrId;
        }
        if (visitDetails && visitDetails.appointmnet && visitDetails.appointmnet.appmtFor && visitDetails.appointmnet.appmtFor[0]) {
          const customerDetails = visitDetails.appointmnet.appmtFor[0];
          // console.log('customerDetailappointmnet::', this.customerDetails)
          const customerId = customerDetails.id;
          const bookingId = visitDetails.appointmnet.uid;
          const bookingType = 'APPT';
          this.medicalService.viewVisitDetails = true;
          this.viewVisitDetails = this.medicalService.viewVisitDetails
          // console.log(this.medicalService.viewVisitDetails)
          this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription']);
        }

      }
      else {
        // alert('appt')
        this.showHideActivityTYpe = true;
        this.showHidepreviousDetails = false;
        this.clinicalOuter = false;
        this.prescriptionOuter = false;
        this.medicalService.viewVisitDetails = false;
      }



    }
    else {
      // alert('3')
      const mrId = visitDetails.mrId;
      const customerDetails = visitDetails.providerConsumer;
      // console.log('customerDetailFOLLOWUP::', this.customerDetails)
      const customerId = customerDetails.id;
      const bookingId = 0;
      const bookingType = 'FOLLOWUP';
      if (visitDetails.mrCreated) {
        // console.log('1st');
        // alert('1stt::')
        this.medicalService.viewVisitDetails = true;
        this.viewVisitDetails = this.medicalService.viewVisitDetails
        this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription']);
      }
      else {
        // console.log('2nd');
        this.showHideActivityTYpe = true;
        this.showHidepreviousDetails = false;
        this.clinicalOuter = false;
        this.prescriptionOuter = false;
        this.medicalService.viewVisitDetails = false;
      }
    }
  }
  getProviderName(visit) {
    let providerName;
    if (visit.providerName) {
      providerName = visit.providerName;
    } else {
      // console.log('this.provider;',this.provider)
      providerName = this.provider;
    }
    return providerName;
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  addPrescriptionAndClinical(data, text) {
    // console.log('add');
    if (text === 'createPrescription') {
      // alert('prescription')
      // console.log('mrId',this.medicalRecordID)
      if (this.mrId === 0) {
        // if(this.calledForm==='appt'){
        //   let routerId='prescription';
        //   const qparams = { 'prescription': 'prescription' };
        //   const navigationExtras: NavigationExtras = {
        //     queryParams: qparams
        //   };
        //   this.router.navigate(['provider', 'customers',  this.patientId, 'FOLLOWUP', 0, 'medicalrecord', this.mrId,routerId],navigationExtras);
        // }
        // alert('if1st prescription')
        // const mRId=0;
        // const routerId='prescription';
        // this.router.navigate(['provider', 'customers', this.patientId, 'FOLLOWUP',0, 'medicalrecord', mRId,routerId])
        this.showHidepreviousDetails = false;
        this.showHideAddPrescription = true;
        this.showHideClinicalNotes = false;
        this.showHideActivityTYpe = false;
      }
      else {
        // alert('2nd else prescription')
        const mRId = 0;
        const routerId = 'prescription';
        this.router.navigate(['provider', 'customers', this.patientId, 'FOLLOWUP', 0, 'medicalrecord', mRId, routerId])
        this.showHidepreviousDetails = false;
        this.showHideAddPrescription = true;
        this.showHideClinicalNotes = false;
        this.showHideActivityTYpe = false;

      }
      // console.log(' this.mrId', this.mrId)

    }
    else if (text === 'craeteClinicalnotes') {
      // alert('clinical')
      if (this.mrId === 0) {
        this.showHidepreviousDetails = false;
        this.showHideAddPrescription = false;
        this.showHideClinicalNotes = true;
        this.showHideActivityTYpe = false;
      }
      else {
        // alert(';2nd clicnical')
        const mRId = 0;
        const routerId = 'clinicalnotes';
        this.router.navigate(['provider', 'customers', this.patientId, 'FOLLOWUP', 0, 'medicalrecord', mRId, routerId])
        this.showHidepreviousDetails = false;
        this.showHideAddPrescription = false;
        this.showHideClinicalNotes = true;
        this.showHideActivityTYpe = false;
      }
    }
  }
  addPrescriptionAndClinicalSecond(data, text) {
    // console.log(text)
    // console.log(data)
    // console.log(' this.visitDetailsTableValue', this.visitDetailsTableValue)
    if (text === 'createPrescription') {
      this.tempText = text;
      if (this.visitDetailsTableValue.mrCreated === false) {

        if (this.visitDetailsTableValue.appointmnet) {
          let mrId = 0;
          if (this.visitDetailsTableValue.appointmnet.mrId) {
            mrId = this.visitDetailsTableValue.appointmnet.mrId;
          }

          const customerDetails = this.visitDetailsTableValue.appointmnet.appmtFor[0];
          // console.log('customerDetailappointmnet::',  this.customerDetails)
          const customerId = customerDetails.id;
          const bookingId = this.visitDetailsTableValue.appointmnet.uid;
          const bookingType = 'APPT';
          const qparams = { 'prescription': 'prescription' };
          const navigationExtras: NavigationExtras = {
            queryParams: qparams
          };
          this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription'], navigationExtras);
          this.showHidepreviousDetails = false;
          this.showHideAddPrescription = true;
          this.showHideClinicalNotes = false;
          this.showHideActivityTYpe = false;
          this.getPatientVisitList(false, text);
          this.tempText = text;
        }
        else if (this.visitDetailsTableValue.waitlist) {
          let mrId = 0;
          if (this.visitDetailsTableValue.waitlist.mrId) {
            mrId = this.visitDetailsTableValue.waitlist.mrId;
          }

          const customerDetails = this.visitDetailsTableValue.waitlist.waitlistingFor[0];
          // console.log('customerDetailgetMedicalRecord::',  this.customerDetails)
          const customerId = customerDetails.id;
          const bookingId = this.visitDetailsTableValue.waitlist.ynwUuid;
          const bookingType = 'TOKEN';
          const qparams = { 'prescription': 'prescription' };
          const navigationExtras: NavigationExtras = {
            queryParams: qparams
          };
          this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription'], navigationExtras);
          this.getPatientVisitList(false, text);
          this.showHidepreviousDetails = false;
          this.showHideAddPrescription = true;
          this.showHideClinicalNotes = false;
          this.showHideActivityTYpe = false;
          this.tempText = text;
        }
      }
    }
    else if (text === 'craeteClinicalnotes') {
      this.tempText = text;
      if (this.visitDetailsTableValue.mrCreated === false) {

        if (this.visitDetailsTableValue.appointmnet) {
          let mrId = 0;
          if (this.visitDetailsTableValue.appointmnet.mrId) {
            mrId = this.visitDetailsTableValue.appointmnet.mrId;
          }

          const customerDetails = this.visitDetailsTableValue.appointmnet.appmtFor[0];
          // console.log('customerDetailappointmnet::',  this.customerDetails)
          const customerId = customerDetails.id;
          const bookingId = this.visitDetailsTableValue.appointmnet.uid;
          const bookingType = 'APPT';
          const qparams = { 'clinicalnotes': 'clinicalnotes' };
          const navigationExtras: NavigationExtras = {
            queryParams: qparams
          };
          this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'clinicalnotes'], navigationExtras);
          this.getPatientVisitList(false, text);
          this.showHidepreviousDetails = false;
          this.showHideAddPrescription = false;
          this.showHideClinicalNotes = true;
          this.showHideActivityTYpe = false;
          this.tempText = text;
        }


        else if (this.visitDetailsTableValue.waitlist) {
          let mrId = 0;
          if (this.visitDetailsTableValue.waitlist.mrId) {
            mrId = this.visitDetailsTableValue.waitlist.mrId;
          }

          const customerDetails = this.visitDetailsTableValue.waitlist.waitlistingFor[0];
          // console.log('customerDetailgetMedicalRecord::',  this.customerDetails)
          const customerId = customerDetails.id;
          const bookingId = this.visitDetailsTableValue.waitlist.ynwUuid;
          const bookingType = 'TOKEN';
          const qparams = { 'clinicalnotes': 'clinicalnotes' };
          const navigationExtras: NavigationExtras = {
            queryParams: qparams
          };

          this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'clinicalnotes'], navigationExtras);
          this.getPatientVisitList(false, text);
          this.showHidepreviousDetails = false;
          this.showHideAddPrescription = false;
          this.showHideClinicalNotes = true;
          this.showHideActivityTYpe = false;
          this.tempText = text;
        }
      }
    }

  }
  getFileType(type) {
    // console.log('type',type)
    if (type) {
      if (type === 'image/png') {
        return './assets/images/ImgeFileIcon/png.png'
      }
      else if (type === 'application/pdf') {
        return './assets/images/ImgeFileIcon/pdf.png'
      }
      else if (type === 'image/bmp') {
        return './assets/images/ImgeFileIcon/bmp.png'
      }
      else if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return './assets/images/ImgeFileIcon/docsWord.png'
      }
      else if (type === 'video/mp4') {
        return './assets/images/ImgeFileIcon/video.png'
      }
      else if (type === 'image/jpg') {
        return './assets/images/ImgeFileIcon/jpg.png'
      }
      else {
        return './assets/images/ImgeFileIcon/othersFile.png'
      }

    }
  }
  bytesToSize(sizeInBytes: any) {
    var sizeInMB: any = (sizeInBytes / (1024)).toFixed(2);
    var totalSizeMb: any = sizeInMB + 'MB';
    return totalSizeMb;
  }
  deletePrescriptionFile(fileDetails, index) {
    this.deleteFile(fileDetails)

  }
  dialogImgView(fileDetails: any) {
    if (fileDetails) {
      if (fileDetails.keyName && (fileDetails.type === (('image/bmp') || ('image/png') || ('image/jpg')))) {
        if (this.fileService && this.fileService.IMAGE_FORMATS) {
          for (var i = 0; i < this.fileService.IMAGE_FORMATS.length; i++) {
            if (this.fileService.IMAGE_FORMATS[i] === fileDetails.type) {
              const dialogRef = this.dialog.open(PreviewpdfComponent, {
                width: '100%',
                data: {
                  requestType: 'priviewFilePrescription',
                  data: fileDetails,
                }
              })
              dialogRef.afterClosed().subscribe((res) => {
              })
            }
          }
        }
      }
      else {
        if (fileDetails.url) {
          window.open(fileDetails.url);
        }
      }
    }
  }
  originalFilename(fileName) {
    let tempFileName: any;
    let tempFileNameSecondTYpe: any;
    if (fileName && fileName.length > 0 && fileName && fileName.length < 30) {
      tempFileName = fileName.slice(0, fileName.indexOf('.'))
      return tempFileName;
    }
    else if (fileName && fileName.length > 30) {
      tempFileName = fileName.slice(0, fileName.indexOf('.'));
      // console.log('tempFileName',tempFileName)
      if (tempFileName && tempFileName.length > 30) {
        tempFileNameSecondTYpe = tempFileName.slice(0, 30) + ' ...'
        return tempFileNameSecondTYpe;
      }
      // return tempFileName;
    }
  }
  deleteFile(file) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you really want to delete this file?'
      }
    });
    this.subscriptions.sink = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subscriptions.sink = this.provider_services.deleteMRFile(this.mrId, file.uid)
          .subscribe((data) => {
            this.getMedicalRecordUsingId(this.mrId);
          },
            error => {
              // alert('deleteFile')
              // this.reloadComponent()
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
      }

    });
  }
  addClinical(data, text) {
    this.tempClinicalNOtes = true;
  }
  addClinical1() {
    this.tempClinicalNOtes = true;
  }
  addPrescription(data, text) {
    this.tempPrescription = true;
  }
  openDentalChart() {
    if (this.mrecordId) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          patientId: this.patientId,
          mrid: this.mrecordId
        }
      };
      this.router.navigate(['provider', 'dental'], navigationExtras);
      // this.routingService.setFeatureRoute('dental');
      // console.log('navigationExtras;', navigationExtras)
      // this.routingService.handleRoute('', navigationExtras);
    }
    else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          patientId: this.patientId,
          mrid: this.mrId
        }
      };
      this.router.navigate(['provider', 'dental'], navigationExtras);
      // this.routingService.setFeatureRoute('dental');
      // console.log('navigationExtras;', navigationExtras)
      // this.routingService.handleRoute('', navigationExtras);
    }


  }
}

