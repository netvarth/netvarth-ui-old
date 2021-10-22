import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../../app/app.component';
import { ActivatedRoute } from '@angular/router';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';

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
  qr_value: string;
  showQR=false;
  customer_label: any;
  provider_label: any;
  questionnaires: any;
  questionanswers: any;


  constructor(private activated_route:ActivatedRoute, private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,  public dateFormat: DateFormatPipe) { 
    this.activated_route.queryParams.subscribe(qparams=>{
      this.bookingDetails=JSON.parse(qparams.bookingDetails);
      console.log(this.bookingDetails);
   
    });

  }

  ngOnInit(): void {
    console.log(this.bookingDetails);
    console.log('inisde print details module');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.questionnaires=this.bookingDetails.questionnaire;
    this.questionanswers=this.questionnaires.questionAnswers;
    console.log(this.questionnaires);
     this.qrCodegeneration(this.bookingDetails);
         const bprof = this.groupService.getitemFromGroupStorage('ynwbp');
         console.log(bprof);
        const bname = bprof.bn;
        const fname = (this.bookingDetails.waitlistingFor[0].firstName) ? this.bookingDetails.waitlistingFor[0].firstName : '';
        const lname = (this.bookingDetails.waitlistingFor[0].lastName) ? this.bookingDetails.waitlistingFor[0].lastName : '';
        console.log(fname+bname+lname);
        setTimeout(() => {
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
          
            
        });
  }
  qrCodegeneration(valuetogenerate) {
    console.log(valuetogenerate);

    this.qr_value = this.path + 'status/' + valuetogenerate.checkinEncId;
    this.showQR = true;
}
gotoPrev(){

}
getAnswer(question){
  let answerLine=question.answerLine.answer;
  return answerLine[Object.keys(answerLine)[0]];

}

}
