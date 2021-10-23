import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../../app/app.component';
import { ActivatedRoute } from '@angular/router';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { ProviderServices } from '../../services/provider-services.service';
import { Location } from '@angular/common';



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
  showQR=false;
  customer_label: any;
  provider_label: any;
  questionnaires: any;
  questionanswers: any;
  bname: any;
  location: any;
  customerName: any;
  answerSection:any;


  constructor(private activated_route:ActivatedRoute, 
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private providerServices:ProviderServices,
      public dateFormat: DateFormatPipe,
    private locationObject: Location) { 
      this.activated_route.params.subscribe(params => {
        this.bookingId = params.id;
        this.getBookingDetails(this.bookingId).then((data)=>{
          this.bookingDetails=data;
          console.log(this.bookingDetails.date);
          if(this.bookingDetails.questionnaire){
          this.questionnaires=this.bookingDetails.questionnaire;
          this.questionanswers=this.questionnaires.questionAnswers;
          this.groupQuestionsBySection();
          }
          this.setPrintDetails();
        })
      })
  

  }

  ngOnInit(): void {
  
       
  }
  getSectionCount() {
    return Object.keys(this.groupedQnr).length;
  }
  groupQuestionsBySection() {

  const isSectionName=this.questionanswers.filter(obj=>obj.question.hasOwnProperty('sectionName'));
  console.log(isSectionName);
  if(isSectionName.length>0){
      this.groupedQnr = this.questionanswers.reduce(function (rv, x) {
        (rv[x.question['sectionName']] = rv[x.question['sectionName']] || []).push(x);
        return rv;
      }, {});
    }
      
  
  }
  qrCodegeneration(valuetogenerate) {
    console.log(valuetogenerate);

    this.qr_value = this.path + 'status/' + valuetogenerate.checkinEncId;
    this.showQR = true;
}
gotoPrev(){
this.locationObject.back();
}
setPrintDetails(){
  console.log(this.bookingDetails);
    console.log('inisde print details module');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
  
    console.log(this.questionnaires);
     this.qrCodegeneration(this.bookingDetails);
         const bprof = this.groupService.getitemFromGroupStorage('ynwbp');
         console.log(bprof);
      this.bname = bprof.bn;
      const fname = (this.bookingDetails.waitlistingFor[0].firstName) ? this.bookingDetails.waitlistingFor[0].firstName : '';
      const lname = (this.bookingDetails.waitlistingFor[0].lastName) ? this.bookingDetails.waitlistingFor[0].lastName : '';

      this.customerName=fname+" "+ lname;
}
getBookingDetails(bookingId) {
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
printDetails(){
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
  let answerLine=question.answerLine.answer;
  if(Object.keys(answerLine)[0]==='dataGrid'){
    return true;
  }else{
    return false;
  }
}
getAnswer(question){
  let answerLine=question.answerLine.answer;
  if(Object.keys(answerLine)[0]==='fileUpload'){
   if(answerLine.fileUpload.length > 1){
    return answerLine.fileUpload.length +'files uploaded';
   }else{
    if(answerLine.fileUpload.length === 1){
      if(answerLine.fileUpload[0].originalName){
        return answerLine.fileUpload[0].originalName;
      }else{
        return answerLine.fileUpload[0].keyName;
      }
    }
   }
  }
return answerLine[Object.keys(answerLine)[0]];
}

getinnerTableData(column){
  return column[Object.keys(column)[0]];

}
}
