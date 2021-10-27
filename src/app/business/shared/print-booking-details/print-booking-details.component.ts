import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../../app/app.component';
import { ActivatedRoute } from '@angular/router';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { ProviderServices } from '../../services/provider-services.service';
import { Location } from '@angular/common';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';



@Component({
  selector: 'app-print-booking-details',
  templateUrl: './print-booking-details.component.html',
  styleUrls: ['./print-booking-details.component.css']
})
export class PrintBookingDetailsComponent implements OnInit {
  bookingDetails: any;
  elementType = 'url';
  bookingId: any;
  path = projectConstants.PATH;
  groupedQnr: any = [];
  qr_value: string;
  showQR = false;
  customer_label: any;
  provider_label: any;
  questionnaires: any;
  questionanswers: any;
  bname: any;
  location: any;
  customerName: any;
  answerSection: any;
  bookingType: any;
  internalStatusLog: any=[];
  customerDetails: any;


  constructor(private activated_route: ActivatedRoute,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private providerServices: ProviderServices,
    public dateFormat: DateFormatPipe,
    private dateTimeProcessor: DateTimeProcessor,
    private locationObject: Location) {
    this.activated_route.params.subscribe(params => {
      this.bookingId = params.id;
      this.activated_route.queryParams.subscribe(qparams => {
        this.bookingType = qparams.bookingType;
        if (this.bookingType === 'appt') {
          this.getApptBookingDetails(this.bookingId).then((data) => {
            this.bookingDetails = data;
            this.customerDetails=this.bookingDetails.appmtFor[0];
            if (this.bookingDetails.questionnaire) {
              this.questionnaires = this.bookingDetails.questionnaire;
              this.questionanswers = this.questionnaires.questionAnswers;
              if (this.questionanswers) {
                this.groupQuestionsBySection();
              }
            };
            this.setPrintDetails();
          });
          this.getAppointmentInternalStatus(this.bookingId).then((data) =>{
            this.internalStatusLog=data;
          });
        }
        if (this.bookingType === 'checkin') {
          this.getWaitlistBookingDetails(this.bookingId).then((data) => {
            this.bookingDetails = data;
            this.customerDetails=this.bookingDetails.waitlistingFor[0];
            if (this.bookingDetails.questionnaire) {
              this.questionnaires = this.bookingDetails.questionnaire;
              this.questionanswers = this.questionnaires.questionAnswers;
               if(this.questionanswers){
                this.groupQuestionsBySection();
                }   
               };
              this.setPrintDetails();
          });
          this.getWaitlistInternalStatusLog(this.bookingId).then((data) =>{
            this.internalStatusLog=data;
          });
        }
      })


    });


  }
  getAppointmentInternalStatus(uuid) {
    const _this = this;
    return new Promise(function (resolve, reject) {

      _this.providerServices.getProviderAppointmentInternalStatusHistory(uuid)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });

  }
  getWaitlistInternalStatusLog(uuid) {
    const _this = this;
    return new Promise(function (resolve, reject) {

      _this.providerServices.getProviderWaitlistinternalHistroy(uuid)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });

  }

  ngOnInit(): void {


  }
  getSectionCount() {
    return Object.keys(this.groupedQnr).length;
  }
  groupQuestionsBySection() {

    const isSectionName = this.questionanswers.filter(obj => obj.question.hasOwnProperty('sectionName'));
    console.log(isSectionName);
    if (isSectionName.length > 0) {
      this.groupedQnr = this.questionanswers.reduce(function (rv, x) {
        (rv[x.question['sectionName']] = rv[x.question['sectionName']] || []).push(x);
        return rv;
      }, {});
    }


  }
  qrCodegeneration(valuetogenerate) {
    console.log('valuetogenerate' + valuetogenerate);
    if (this.bookingType === 'checkin') {
      this.qr_value = this.path + 'status/' + valuetogenerate.checkinEncId;
    } else {
      this.qr_value = this.path + 'status/' + valuetogenerate.appointmentEncId;
    }
    this.showQR = true;
  }
  gotoPrev() {
    this.locationObject.back();
  }
  setPrintDetails() {

    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.qrCodegeneration(this.bookingDetails);
    const bprof = this.groupService.getitemFromGroupStorage('ynwbp');
    this.bname = bprof.bn;
    if (this.bookingType === 'appt') {
      const fname = (this.bookingDetails.appmtFor[0].firstName) ? this.bookingDetails.appmtFor[0].firstName : '';
      const lname = (this.bookingDetails.appmtFor[0].lastName) ? this.bookingDetails.appmtFor[0].lastName : '';
      if (fname !== '' || lname !== '') {
        this.customerName = fname + " " + lname;
      }
      else {
        this.customerName = this.bookingDetails.providerConsumer.jaldeeId
      }

    } else {
      const fname = (this.bookingDetails.waitlistingFor[0].firstName) ? this.bookingDetails.waitlistingFor[0].firstName : '';
      const lname = (this.bookingDetails.waitlistingFor[0].lastName) ? this.bookingDetails.waitlistingFor[0].lastName : '';
      if (fname !== '' || lname !== '') {
        this.customerName = fname + " " + lname;
      }
      else {
        this.customerName = this.bookingDetails.consumer.jaldeeId
      }
    }


  }
  getApptBookingDetails(bookingId) {
    const _this = this;
    return new Promise(function (resolve, reject) {

      _this.providerServices.getAppointmentById(bookingId)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );

    });

  }
  getWaitlistBookingDetails(bookingId) {
    const _this = this;
    return new Promise(function (resolve, reject) {

      _this.providerServices.getProviderWaitlistDetailById(bookingId)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );

    });

  }
  printDetails() {
    let printContent = document.getElementById('print-section').innerHTML;
    const params = [
      'height=' + screen.height,
      'width=' + screen.width,
      'fullscreen=yes'
    ].join(',');
    const printWindow = window.open('', '', params);


    printWindow.document.write(`
    <html>
      <head>
        <title>Print tab</title>
      </head>
  <body onload="window.print();window.close()">${printContent}</body>
    </html>`
    );
    printWindow.document.close();

  }
  isDatagrid(question) {
    let answerLine = question.answerLine.answer;
    if (Object.keys(answerLine)[0] === 'dataGrid') {
      return true;
    } else {
      return false;
    }
  }
  getAnswer(question) {
    let answerLine = question.answerLine.answer;
    if (Object.keys(answerLine)[0] === 'fileUpload') {
      let filesuploaded = '';
      for (let file of answerLine.fileUpload) {
        if (file.originalName) {
          filesuploaded += file.originalName + ',';
        } else {
          filesuploaded += file.keyName + ',';
        }

      }
      return filesuploaded.substring(0, filesuploaded.length - 1);
    }
    return answerLine[Object.keys(answerLine)[0]];
  }

  getinnerTableData(column) {
    return column[Object.keys(column)[0]];

  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
}
