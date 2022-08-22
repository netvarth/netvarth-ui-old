import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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



@Component({
  selector: 'app-medicalrecord',
  templateUrl: './medicalrecord.component.html',
  styleUrls: ['./medicalrecord.component.css']
})
export class MedicalrecordComponent implements OnInit {
  public lastVisit_dataSource = new MatTableDataSource<any>([]);
  previousLIst:any;
  lastVisit_displayedColumns = ['consultationDate', 'mrId','serviceName', 'userName', 'mr'];
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
  medicalRecordBtnName:string='Create';
  mrDateFromTableRow:any;
  showHidepreviousDetails:boolean=true;
  showHideAddPrescription:boolean;
  showHideClinicalNotes:boolean;
  medicalRecordID:any;
  private subscriptions = new SubSink();
  mRListUsingId:any;
  showHideActivityTYpe:boolean=false;
  prescriptionOuter:boolean=true;
  clinicalOuter:boolean=true;
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
      if (queryParams['calledfrom']) {
        this.medicalService.setCalledFrom(queryParams['calledfrom']);
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
  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    this.provider = user.userName
    this.medicalService.setDoctorId(user.id);
    this.activated_route.paramMap.subscribe(params => {
      this.patientId = params.get('id');
      this.bookingType = params.get('type');
      this.bookingId = params.get('uid');
      const medicalrecordId = params.get('mrId');
      this.mrId = parseInt(medicalrecordId, 0);
      this.medicalService.setParams(this.bookingType, this.bookingId);
      this.getPatientVisitListCount();
      this.getPatientVisitList();
      console.log('this.mrId',this.mrId)
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
    console.log("viewVisitDetails :", this.medicalService.viewVisitDetails)


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
        this.customerDetails = response.appmtFor[0];
        console.log('customerDetailsappmtFor::',  this.customerDetails)
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
        this.customerDetails = response.waitlistingFor[0];
        console.log('customerDetailswaitlistingFor::',  this.customerDetails)
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
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getPatientDetails(uid) {
    const filter = { 'id-eq': uid };
    this.subscriptions.sink= this.provider_services.getCustomer(filter)
      .subscribe(
        (data: any) => {
          const response = data;
          this.loading = false;
          this.customerDetails = response[0];
          console.log('customerDetailPatientDetails::',  this.customerDetails);
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
    event.target.classList.add('mat-tab-link-active');
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, routerId]);

  }

  getPatientVisitList() {
    this.provider_services.getPatientVisitList(this.patientId)
      .subscribe((data: any) => {
        this.lastVisit_dataSource = data;
        console.log('lastVisit_dataSource::',this.lastVisit_dataSource);
        this.previousLIst= data;
        this.showHidepreviousDetails=true;
        this.loading_table = false;
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
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

        this.snackbarService.openSnackBar('Medical Record updated successfully');
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });


  }




  getMedicalRecordUsingId(mrId) {
    this.subscriptions.sink= this.provider_services.GetMedicalRecord(mrId)
      .subscribe((data: any) => {
        if (data) {
          console.log('getMedicalRecordUsingId',data)
          this.loading = false;
          this.mrNumber = data.mrNumber;
          if(data.prescriptions && data.prescriptions.prescriptionsList && data.prescriptions.prescriptionsList.length){
            this.mRListUsingId= data.prescriptions.prescriptionsList.length;
            console.log('this.mRListUsingId:::',this.mRListUsingId)
          }
          if(data.mrCreatedDate){
            this.mrCreatedDate = data.mrCreatedDate;
          }
          this.activityLogs = data.auditLogs;
          if(data.mrConsultationDate){
            this.visitdate = data.mrConsultationDate;
          }
          if (data.mrVideoAudio) {
            this.uploadFiles = data.mrVideoAudio;
            console.log('this.uploadFiles',this.uploadFiles)
            // this.image_list_popup = [];
            // for (let i = 0; i < this.uploadFiles.length; i++) {
            //   const imgdet = { 'name': this.uploadFiles[i].originalName, 'keyName': this.uploadFiles[i].keyName, 'size': this.uploadFiles[i].imageSize, 'caption': this.uploadFiles[i].caption , 'url': this.uploadFiles[i].url , 'type': this.uploadFiles[i].type};
            //   this.selectedMessage.files.push(imgdet);
            //   const imgobj = new Image(i,
            //     { // modal
            //       img: imgdet.url,
            //       description:  this.uploadFiles[i].caption || ''
            //     });
            //   this.image_list_popup.push(imgobj);
            // }
          }
          if (data.department) {
            this.department = data.service.department;
          } if (data.service) {
            this.serviceName = data.service.name;
          }
          this.medicalService.setServiceDept(this.serviceName, this.department);
          this.customerDetails = data.providerConsumer;
          console.log('customerDetailMedicalRecordUsingId::',  this.customerDetails)
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
    if (type_from === 'medical') {
      this.medicalService.viewVisitDetails = false;
      this.viewVisitDetails = false
      this.location.back();
    }
    else {
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
                    this.customerphoneno = this.data[0].phoneNo;
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
      console.log(result)
      if (result) {
        this.getMedicalRecordUsingId(result);
      }
    });
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
      console.log(result)
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
    console.log('visit-medicalRecordBtnName::::',visit)
    let mrCreated = false;
    if (visit.mrCreated) {
      this.medicalRecordBtnName='Create'
      mrCreated = visit.mrCreated;
    }
    else{
      this.medicalRecordBtnName='View'
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
      return dateCreated[0];
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
    console.log('visitDetails:::',visitDetails)
    // this.selectedRowIndex = visitDetails.mrId;
    if (visitDetails.waitlist) {
      // alert('1')
      // showHideActivityTYpe
      if(visitDetails.mrCreated){
        this.showHideActivityTYpe=false;
        this.clinicalOuter=true;
        this.prescriptionOuter=true;
        let mrId = 0;
      if (visitDetails.waitlist.mrId) {
        mrId = visitDetails.waitlist.mrId;
      }

      const customerDetails = visitDetails.waitlist.waitlistingFor[0];
      console.log('customerDetailgetMedicalRecord::',  this.customerDetails)
      const customerId = customerDetails.id;
      const bookingId = visitDetails.waitlist.ynwUuid;
      const bookingType = 'TOKEN';
      //  this.dialogRef.close();
      this.medicalService.viewVisitDetails = true;
      this.viewVisitDetails = this.medicalService.viewVisitDetails
      console.log(this.medicalService.viewVisitDetails)

      this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId]);
      }
      else{
        this.showHideActivityTYpe=true;
        this.showHidepreviousDetails=false;
        this.clinicalOuter=false;
        this.prescriptionOuter=false
      }
      

    } else if (visitDetails.appointmnet) {
      // alert('2')
      if(visitDetails.mrCreated){
        let mrId = 0;
        if (visitDetails.appointmnet.mrId) {
          mrId = visitDetails.appointmnet.mrId;
        }
  
        const customerDetails = visitDetails.appointmnet.appmtFor[0];
        console.log('customerDetailappointmnet::',  this.customerDetails)
        const customerId = customerDetails.id;
        const bookingId = visitDetails.appointmnet.uid;
        const bookingType = 'APPT';
        //  this.dialogRef.close();
        this.medicalService.viewVisitDetails = true;
        this.viewVisitDetails = this.medicalService.viewVisitDetails
        console.log(this.medicalService.viewVisitDetails)
  
        this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId]);
      }
      else{
        this.showHideActivityTYpe=true;
        this.showHidepreviousDetails=false;
        this.clinicalOuter=false;
        this.prescriptionOuter=false
      }
      


    } else {
      // alert('3')
      const mrId = visitDetails.mrId;
      const customerDetails = visitDetails.providerConsumer;
      console.log('customerDetailFOLLOWUP::',  this.customerDetails)
      const customerId =customerDetails.id;
      const bookingId = 0;
      const bookingType = 'FOLLOWUP';
      if(visitDetails.mrCreated){
        console.log('1st');
        // alert('1stt::')
        this.medicalService.viewVisitDetails = true;
        this.viewVisitDetails = this.medicalService.viewVisitDetails
        // console.log(this.medicalService.viewVisitDetails)
        // console.log("visit Details", visitDetails);
        // console.log('this.mrId',this.mrId)
        // this.getMedicalRecordUsingId(visitDetails.mrId)
        this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId , 'prescription']);
      }
      else{
        console.log('2nd');
        // alert('2nd::')
        this.showHideActivityTYpe=true;
        this.showHidepreviousDetails=false;
        this.clinicalOuter=false;
        this.prescriptionOuter=false
        this.medicalService.viewVisitDetails = false;
        // this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId , 'prescription']);
      }
    }
  }
  getProviderName(visit) {
    let providerName;
    if (visit.providerName) {
      providerName = visit.providerName;
    } else {
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
  addPrescriptionAndClinical(id,text){
    console.log('add');
    if(text==='createPrescription'){
      console.log('mrId',this.medicalRecordID)
      if(this.mrId===0){
        this.showHidepreviousDetails = false;
        this.showHideAddPrescription=true;
        this.showHideClinicalNotes=false;
        this.showHideActivityTYpe=false;
      }
      else{
        const mRId=0;
      const routerId='prescription';
      this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', mRId,routerId]);
      this.showHidepreviousDetails = false;
      this.showHideAddPrescription=true;
      this.showHideClinicalNotes=false;
      this.showHideActivityTYpe=false;
      }


      // this.showHidepreviousDetails = false;
      // this.showHideAddPrescription=true;
      // this.showHideClinicalNotes=false;
      // this.showHideActivityTYpe=false;
      
      console.log(' this.mrId', this.mrId)
      
    }
    else if(text==='craeteClinicalnotes'){
      if(this.mrId===0){
        this.showHidepreviousDetails = false;
      this.showHideAddPrescription=false;
      this.showHideClinicalNotes=true;
      this.showHideActivityTYpe=false;
      }
      else{
        const routerId='clinicalnotes';
      const mRId=0
      this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', mRId,routerId]);
        this.showHidepreviousDetails = false;
      this.showHideAddPrescription=false;
      this.showHideClinicalNotes=true;
      this.showHideActivityTYpe=false;
      }
      
      // this.showHidepreviousDetails = false;
      // this.showHideAddPrescription=false;
      // this.showHideClinicalNotes=true;
      // this.showHideActivityTYpe=false;
      
    }
    }
  getFileType(type){
    // console.log('type',type)
    if(type){
      if(type==='image/png'){
        return './assets/images/ImgeFileIcon/png.png'
      }
      else if(type==='application/pdf'){
        return './assets/images/ImgeFileIcon/pdf.png'
      }
      else if(type==='image/bmp'){
        return './assets/images/ImgeFileIcon/bmp.png'
      }
      else if(type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
        return './assets/images/ImgeFileIcon/docsWord.png'
      }
      else if(type==='video/mp4'){
        return './assets/images/ImgeFileIcon/video.png'
      }
      else if(type==='image/jpg'){
        return './assets/images/ImgeFileIcon/jpg.png'
      }
      else{
        return './assets/images/ImgeFileIcon/othersFile.png'
      }

    }
  }
  bytesToSize(sizeInBytes:any) {
    var sizeInMB:any = (sizeInBytes / (1024)).toFixed(2);
    var totalSizeMb :any =sizeInMB + 'MB' ;
    return totalSizeMb;
  }
  deletePrescriptionFile(fileDetails,index){
    this.deleteFile(fileDetails)

  }
  dialogImgView(fileDetails:any){
    if(fileDetails){
      if(fileDetails.keyName && (fileDetails.type===(('image/bmp') || ('image/png') || ('image/jpg')))){
        if(this.fileService && this.fileService.IMAGE_FORMATS){
          for(var i=0;i<this.fileService.IMAGE_FORMATS.length;i++){
            if(this.fileService.IMAGE_FORMATS[i]===fileDetails.type){
              const dialogRef= this.dialog.open(PreviewpdfComponent,{
                width:'100%',
                data:{
                  requestType:'priviewFilePrescription',
                  data:fileDetails,
                }
              })
              dialogRef.afterClosed().subscribe((res)=>{
              })
            }
          }
        }
      }
      else{
        if(fileDetails.url){
          window.open(fileDetails.url);
        }
      } 
    }
  }
  originalFilename(fileName){
    let tempFileName:any;
    let tempFileNameSecondTYpe:any;
    if(fileName.length > 0 && fileName.length <30 ){
       tempFileName= fileName.slice(0,fileName.indexOf('.'))
      return tempFileName;
    }
    else if(fileName.length > 30){
      tempFileName= fileName.slice(0,fileName.indexOf('.')) ;
      // console.log('tempFileName',tempFileName)
      if(tempFileName.length>30){
       tempFileNameSecondTYpe= tempFileName.slice(0,30) + ' ...'
       return tempFileNameSecondTYpe;
      }
      // return tempFileName;
    }
  }
  deleteFile(file) {
   const dialogRef= this.dialog.open(ConfirmBoxComponent, {
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
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
      }

    });
  }
}

