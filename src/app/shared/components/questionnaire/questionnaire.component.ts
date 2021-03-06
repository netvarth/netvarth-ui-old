import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { SharedServices } from '../../services/shared-services';
import { SnackbarService } from '../../services/snackbar.service';
import { WordProcessor } from '../../services/word-processor.service';

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
  answers: any = {};
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  apiError = [];
  params;
  constructor(private sharedService: SharedServices,
    private datepipe: DateFormatPipe,
    private activated_route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private router: Router,
    private location: Location) {
    this.activated_route.queryParams.subscribe(qparams => {
      this.params = qparams;
      console.log(this.params);
      if (this.params.providerId) {
        this.accountId = this.params.providerId;
      }
      if (this.params.serviceId) {
        this.serviceId = this.params.serviceId;
      }
      if (this.params.consumerId) {
        this.consumerId = this.params.consumerId;
      }
      if (this.params.type) {
        this.source = this.params.type;
      }
      if (this.params.channel) {
        this.channel = this.params.channel;
      }
    });
  }

  ngOnInit(): void {
    console.log(this.questionAnswers);
    if (this.questionAnswers) {
      if (this.questionAnswers.answers) {
        this.getAnswers(this.questionAnswers.answers.answer, 'init');
        console.log(this.answers);
      }
      if (this.questionAnswers.files) {
        this.selectedMessage = this.questionAnswers.files;
      }
    } else {
  if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
    this.getAnswers(this.questionnaireList.labels);
      }
    }
    console.log(this.source);
    console.log(this.params.uuid);
    if (this.params.uuid) {
    if (this.source === 'consCheckin' || this.source === 'consAppt') {
      this.getConsumerQuestionnaire();
    } else {
      this.getProviderQuestionnaire();
    }
  }
  }
  getAnswers(answerData, type?) {
    console.log(answerData);
    console.log(type);
    if (!type || type === 'get') {
      for (let answ of answerData) {
        console.log(answ);
        if (answ.answer && answ.question.fieldDataType !== 'FileUpload') {
          this.answers[answ.answer.questionId] = answ.answer.answer;
        }
      }
    } else {
      for (let answ of answerData) {
        console.log(answ);
        this.answers[answ.questionId] = answ.answer;
      }
    }
    console.log(this.answers);
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
    this.onSubmit();
  }
  deleteTempImage(i, label) {
    let imgname = this.selectedMessage.files[i].name.split('.');
        imgname = imgname[0];
    console.log(this.selectedMessage.files[i].name);
    console.log(this.answers[label]);
    delete this.answers[label][i];
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
    console.log(this.answers);
    this.onSubmit();
  }
  getConsumerQuestionnaire() {
    this.sharedService.getConsumerQuestionnaire(this.serviceId, this.consumerId, this.accountId).subscribe(data => {
      console.log(data);
      this.questionnaireList = data;
      if (this.params.questionnaireAnswers && this.params.questionnaireAnswers.length > 0) {
        this.getAnswers(this.params.questionnaireAnswers, 'get');
      }
    });
  }
  getProviderQuestionnaire() {
    this.sharedService.getProviderQuestionnaire(this.serviceId, this.consumerId, this.channel).subscribe(data => {
      console.log(data);
      this.questionnaireList = data;
      if (this.params.questionnaireAnswers && this.params.questionnaireAnswers.length > 0) {
        this.getAnswers(this.params.questionnaireAnswers, 'get');
      }
    });
  }
  onSubmit(type?) {
    console.log(this.answers);
    let data = [];
    Object.keys(this.answers).forEach(key => {
      console.log(key);
      console.log(this.answers[key]);
      console.log(this.answers[key].length);
      console.log(Object.keys(this.answers[key]).length);
      if (this.answers[key] && Object.keys(this.answers[key]).length > 0) {
      data.push({
        'questionId': key,
        'answer': this.answers[key]
      });
    }
    });
    console.log(data);
if (data.length > 0) {
    const postData = {
      'questionnaireId': this.questionnaireList.id,
      'answer': data
    }
    console.log(this.selectedMessage);
    console.log(postData);
    const passData = { 'answers': postData, 'files': this.selectedMessage };
    if (type) {
      this.submitQuestionnaire(passData);
    } else {
      this.returnAnswers.emit(passData);
    }
  }
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
    this.onSubmit();
  }
  booleanChange(ev, question) {
    this.answers[question.labelName] = ev.checked;
    this.onSubmit();
  }
  isChecked(value, question) {
    if (this.answers[question.labelName]) {
      const indx = this.answers[question.labelName].indexOf(value);
      if (indx !== -1) {
        return true;
      } else {
        return false;
      }
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
    this.onSubmit();
  }
  submitQuestionnaire(passData) {
    const dataToSend: FormData = new FormData();
    if (passData.files) {
      for (const pic of passData.files.files) {
        dataToSend.append('files', pic, pic['name']);
      }
    }
    console.log(passData.answers);
    console.log(JSON.stringify(passData.answers));
    const blobpost_Data = new Blob([JSON.stringify(passData.answers)], { type: 'application/json' });
    dataToSend.append('question', blobpost_Data);
   if (this.params.source === 'consumerApptResubmit' || this.params.source === 'consumerWaitlistResubmit') {
      this.resubmitConsumerQuestionnaire(dataToSend);
    } else {
      this.resubmitProviderQuestionnaire(dataToSend);
    }
  }
  resubmitConsumerQuestionnaire(body) {
    this.sharedService.resubmitConsumerQuestionnaire(body, this.params.uuid, this.accountId).subscribe(data => {
      this.router.navigate(['/consumer']);
    }, error => {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitProviderQuestionnaire(body) {
    this.sharedService.resubmitProviderQuestionnaire(body, this.params.uuid).subscribe(data => {
      this.router.navigate(['/provider/appointments']);
    }, error => {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  goBack() {
    this.location.back();
  }
}
