import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { SharedServices } from '../../services/shared-services';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  @Input() questionnaireList;
  @Input() source;
  @Input() consumerId;
  @Input() serviceId;
  @Input() accountId;
  @Input() channel;
  @Input() questionAnswers;
  @Output() returnAnswers = new EventEmitter<any>();
  answers;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  apiError = [];
  constructor(private sharedService: SharedServices,
    private datepipe: DateFormatPipe) { }

  ngOnInit(): void {
    console.log(this.questionAnswers);
    if (this.questionAnswers) {
      if (this.questionAnswers.answers) {
this.answers = this.getAnswers(this.questionAnswers.answers, 'init');
      }
      if (this.questionAnswers.files) {
        this.selectedMessage = this.questionAnswers.files;
              }
    }
    console.log(this.source);
    console.log(this.answers);
    if (this.source === 'consCheckin' || this.source === 'consAppt') {
      this.getConsumerQuestionnaire();
    } else {
      this.getProviderQuestionnaire();
    }
  }
  getAnswers(answerData, type) {
    if (type === 'init') {
for (let answer of answerData) {
  this.answers[answer.questionId] = answer.answer;
}
    } else {
      for (let answer of answerData) {
        this.answers[answer.questionId] = answer.answer;
      }
    }
  }
  filesSelected(event, index, question) {
    const input = event.target.files;
    this.apiError[index] = null;
    this.answers[question.labelName] = {};
    if (input) {
      for (const file of input) {
        console.log(file);
        console.log(question.filePropertie.fileTypes);
        console.log(question.filePropertie.fileTypes.indexOf(file.type));
        // if (question.filePropertie.fileTypes.indexOf(file.type) === -1) {
        //   this.apiError[index] = 'Selected image type not supported';
        // } else if (file.size > question.filePropertie.minSize) {
        //   this.apiError[index] = 'Please upload images with size > ' + question.filePropertie.minSize + 'mb';
        // } else if (file.size > question.filePropertie.maxSize) {
        //   this.apiError[index] = 'Please upload images with size < ' + question.filePropertie.maxSize + 'mb';
        // } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          console.log(file.name);
          let imgname = file.name.split('.');
          imgname = imgname[0];
          const indx = this.selectedMessage.files.indexOf(file);
          console.log(indx);
          this.answers[question.labelName][indx] = imgname;
          reader.readAsDataURL(file);
        // }
      }
      console.log(this.selectedMessage);
      console.log(this.apiError);
      console.log(this.answers);
    }
  }
  getConsumerQuestionnaire() {
    this.consumerId = 0;
    this.sharedService.getConsumerQuestionnaire(this.serviceId, this.consumerId, this.accountId).subscribe(data => {
      console.log(data);
      this.questionnaireList = data;
      if (!this.questionAnswers) {

      }
    });
  }
  getProviderQuestionnaire() {
    // this.consumerId = 0;
    this.sharedService.getProviderQuestionnaire(this.serviceId, this.consumerId, this.channel).subscribe(data => {
      console.log(data);
      this.questionnaireList = data;
    });
  }
  onSubmit() {
    console.log(this.answers);
    let data = [];
    Object.keys(this.answers).forEach(key => {
      console.log(key);
      console.log(this.answers[key]);;
      data.push({
        'questionId': key,
        'answer': this.answers[key]
      });
    });

    const postData = {
      'questionnaireId': this.questionnaireList.id,
      'answer': data
    }
    console.log(this.selectedMessage);
    console.log(postData);
    const passData = {'answers': postData, 'files': this.selectedMessage};
this.returnAnswers.emit(passData);
  }
  getDate(date) {
    return new Date(this.datepipe.transformTofilterDate(date));
  }
  listChange(ev, value, question) {
    console.log(this.answers);
    if (ev.checked) {
      if (!this.answers[question.labelName]) {
        this.answers[question.labelName] = [];
      }
      this.answers[question.labelName].push(value);
    } else {
      const indx = this.answers[question.labelName].indexOf(value);
      console.log(indx);
      this.answers[question.labelName].splice(indx, 1);
    }
    console.log(this.answers);
  }
  booleanChange(ev, question) {
    this.answers[question.labelName] = ev.checked;
  }
  isChecked(value, question) {
    if (this.answers[question.labelName] && this.answers[question.labelName] === value) {
      return true;
    } else {
      return false;
    }
  }
  isBooleanChecked(question) {
    if (this.answers[question.labelName]) {
      return true;
    } else {
      return false;
    }
  }
  dateChange(ev, question) {
    console.log(ev);
    this.answers[question.labelName] = this.datepipe.transformTofilterDate(ev);
  }
}
