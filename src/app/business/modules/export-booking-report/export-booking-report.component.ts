import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ExportReportService } from '../reports/export-report.service';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { WordProcessor } from '../../../shared/services/word-processor.service';


@Component({
  selector: 'app-export-booking-report',
  templateUrl: './export-booking-report.component.html',
  styleUrls: ['./export-booking-report.component.css']
})
export class ExportBookingReportComponent implements OnInit {
  bookingList: any;
  criteriaText: any;
  headerColumns;
  provider_label = '';
  customer_label = '';
  dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  @ViewChild('source') source: ElementRef;

  constructor(public dialogRef: MatDialogRef<ExportBookingReportComponent>,
    @Inject(MAT_DIALOG_DATA) public booking: any,
    private shared_functions: SharedFunctions,
    private exportService: ExportReportService,
    private wordProcessor:WordProcessor) {
      this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
      this.customer_label = this.wordProcessor.getTerminologyTerm('customer');


    // this.bookingList = booking.bookingList;
  }
  getQuestionAnswers(a: any) {
    // console.log("Booking Before");
    // console.log(a);
    let questionAnswers = [];
    if (a.questionnaires && a.questionnaires.length > 0) {
      questionAnswers = [...a.questionnaires.map((a => a.questionAnswers))];
    }
    // console.log(questionAnswers);
    return questionAnswers;
    // return questionAnswers;
  }
  ngOnInit(): void {
    const _this = this;
    if (this.booking.criteria && this.booking.criteria === 'LAST_THIRTY_DAYS') {
      this.criteriaText = "This is collection of Last 30 Days and Today's Report"
    } else if (this.booking.criteria && this.booking.criteria === 'LAST_WEEK') {
      this.criteriaText = "This is collection of Last 7 Days and Today's Report"
    }
    this.bookingList = this.booking.bookingList.map(function (a) {
      let customerName = '';
      if (a.waitlistingFor) {
        if (a.waitlistingFor[0].firstName) {
          customerName = a.waitlistingFor[0].firstName;
        }
        if (a.waitlistingFor[0].lastName) {
          customerName += " " + a.waitlistingFor[0].lastName;
        }
      }
      if (a.appmtFor) {
          if (a.appmtFor[0].firstName) {
            customerName = a.appmtFor[0].firstName;
          }
          if (a.appmtFor[0].lastName) {
            customerName += " " + a.appmtFor[0].lastName;
          }
      }
      a['customerName'] = customerName;
      if (a.provider) {
        let providerName = '';
        if (a.provider.firstName) {
          providerName = a.provider.firstName;
        }
        if (a.provider.lastName) {
          providerName += " " + a.provider.lastName;
        }
        a['providerName'] = providerName;
      }
      console.log(a);

      let questionAnswersList = _this.getQuestionAnswers(a);
      if (questionAnswersList.length > 0) {
        let questionsList = questionAnswersList[0].map((q) => q.question);
        a.questionList = _this.shared_functions.groupBy(questionsList, 'id');
        let answerList = questionAnswersList[0].map((an) => an.answerLine ? an.answerLine : { 'id': an.question.id, labelName: '' });
        a.answerList = _this.shared_functions.groupBy(answerList, 'id');
      }
      return a;
    });
    this.headerColumns = {};
    let columnValues = [];
    this.bookingList.forEach(booking => {
      if (booking.questionList) {
        Object.keys(booking.questionList).forEach(key => {
          if (columnValues.indexOf(key) === -1) {
            columnValues[key] = key;
            this.headerColumns[key] = booking.questionList[key][0].label;
          }
        })
      }
    });
    console.log(this.bookingList);
  }
  exportToExcel() {
    this.exportService.exportToExcelFromHTml(this.source.nativeElement, 'qReport');
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
