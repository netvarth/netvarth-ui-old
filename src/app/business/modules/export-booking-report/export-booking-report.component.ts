import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ExportReportService } from '../reports/export-report.service';

@Component({
  selector: 'app-export-booking-report',
  templateUrl: './export-booking-report.component.html',
  styleUrls: ['./export-booking-report.component.css']
})
export class ExportBookingReportComponent implements OnInit {
  bookingList: any;
  headerColumns;
  @ViewChild('source') source: ElementRef;

  constructor(public dialogRef: MatDialogRef<ExportBookingReportComponent>,
    @Inject(MAT_DIALOG_DATA) public booking: any,
    private shared_functions: SharedFunctions,
    private exportService: ExportReportService) {
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
    this.bookingList = this.booking.bookingList.map(function (a) {
      let questionAnswersList = _this.getQuestionAnswers(a);
      // console.log(questionAnswersList);
      if (questionAnswersList.length > 0) {
        let questionsList = questionAnswersList[0].map((q) => q.question);
        // console.log("Question List:");
        // console.log(questionsList);
        a.questionList = _this.shared_functions.groupBy(questionsList, 'id');
        let answerList = questionAnswersList[0].map((an) => an.answerLine ? an.answerLine : { 'id': an.question.id, labelName: '' });
        // console.log("Answer List:");
        // console.log(answerList);
        a.answerList = _this.shared_functions.groupBy(answerList, 'id');
      }
      return a;
    });
    this.headerColumns = {};
    let columnValues = [];
    this.bookingList.forEach(booking => {
      // console.log("Booking:");
      // console.log(booking);
      if (booking.questionList) {
        Object.keys(booking.questionList).forEach(key => {
          if (columnValues.indexOf(key) === -1) {
            columnValues[key] = key;
            this.headerColumns[key] = booking.questionList[key][0].label;
          }
        })
      }
      // console.log(this.headerColumns);
    });
    // console.log(this.bookingList);
  }
  exportToExcel() {
    this.exportService.exportToExcelFromHTml(this.source.nativeElement, 'qReport');
  }
  closeDialog () {
    this.dialogRef.close();
  }
}
