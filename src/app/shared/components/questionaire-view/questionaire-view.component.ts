import { Component, Input, OnInit } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';
import { FileService } from '../../services/file-service';
// import { DateTimeProcessor } from '../../services/datetime-processor.service';

@Component({
  selector: 'app-questionaire-view',
  templateUrl: './questionaire-view.component.html',
  styleUrls: ['./questionaire-view.component.css']
})
export class QuestionaireViewComponent implements OnInit {

  groupedQnr: any = [];
  @Input() questionaire;
  @Input() source;
  questions: any;
  questionnaire_heading = '';
  questionAnswers;
  answers: any;
  dataGridColumnsAnswerList: any;
  dataGridColumns: {};
  constructor(
    // private dateProcessor: DateTimeProcessor,
    private sharedFunctions: SharedFunctions,
    private fileService: FileService
  ) { }

  ngOnInit(): void {

    this.questions = this.questionaire.questionAnswers;
    console.log("Questions:", this.questions);
    this.groupQuestionsBySection();
    this.getAnswers = (this.questions);
  }

  openFile(file) {
    window.open(file, '_blank');
  }

  groupQuestionsBySection() {
    if (this.source === 'customer-create' || this.source === 'qnrDetails' || this.source === 'onetime') {
      this.groupedQnr = this.sharedFunctions.groupBy(this.questions, 'sectionName');
    } else if (this.source === 'proLead') {
      this.groupedQnr = this.questions.reduce(function (rv, x) {
        (rv[x.question['sequnceId']] = rv[x.question['sequnceId']] || []).push(x);
        return rv;
      }, {});
    } else {
      this.groupedQnr = this.questions.reduce(function (rv, x) {
        (rv[x.question['sectionOrder']] = rv[x.question['sectionOrder']] || []).push(x);
        return rv;
      }, {});
    }
  }
  getAnswers(answerData, type?) {
    this.answers = new Object();
    for (let answ of answerData) {
      if (answ.answerLine) {
        this.answers[answ.answerLine.labelName] = answ.answerLine.answer[answ.question.fieldDataType];
      }
    }
  }
  getImg(url, file) {
    return this.fileService.getImage(url, file);
  }
  getQuestion(question) {
    if (this.source === 'customer-create' || this.source === 'qnrDetails' || this.source === 'onetime' || this.source === 'serviceOptionAppt') {
      return question;
    } else {
      return question.question;
    }
  }
  asIsOrder(a, b) {
    return 1;
  }
}
