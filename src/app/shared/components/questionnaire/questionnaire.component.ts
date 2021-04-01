import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { SharedServices } from '../../services/shared-services';
import { SnackbarService } from '../../services/snackbar.service';
import { WordProcessor } from '../../services/word-processor.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SharedFunctions } from '../../functions/shared-functions';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../assets/css/style.bundle.css']
})
export class QuestionnaireComponent implements OnInit {
  @Input() questionnaireList;
  @Input() source;
  @Input() accountId;
  @Input() questionAnswers;
  @Input() customerDetails;
  @Output() returnAnswers = new EventEmitter<any>();
  answers: any = {};
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  apiError: any = [];
  params;
  fileuploadpreAnswers: any = {};
  loading = false;
  buttonDisable = false;
  questions: any = [];
  selectedDocs: any = [];
  documentsToUpload = {};
  toppings = new FormControl();
  // toppingList: string[] = ['Aadhar', 'PAN card', 'Voter ID', 'Bank book'];
  subscription: Subscription;
  docu: any = [];
  show_adhar = false;
  show_rCard = false;
  constructor(private sharedService: SharedServices,
    private datepipe: DateFormatPipe,
    private activated_route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private router: Router, private sharedFunctionobj: SharedFunctions,
    private providerService: ProviderServices,
    private location: Location) {
    this.activated_route.queryParams.subscribe(qparams => {
      this.params = qparams;
      console.log(this.params);
      if (this.params.type) {
        this.source = this.params.type;
      }
      if (this.params.providerId) {
        this.accountId = this.params.providerId;
      }
    });
    this.subscription = this.sharedFunctionobj.getMessage().subscribe(message => {
      switch (message.type) {
        case 'qnrValidateError':
          this.setValidateError(message.value);
          break;
      }
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    console.log(this.customerDetails);
    console.log(this.questionAnswers);
    console.log(this.questionnaireList);
    if (this.questionAnswers) {
      if (this.questionAnswers.answers) {
        this.getAnswers(this.questionAnswers.answers.answer, 'init');
        console.log(this.answers);
      }
      if (this.questionAnswers.files) {
        this.selectedMessage = this.questionAnswers.files;
      }
    } else {
      console.log(this.questionnaireList);
      if (this.questionnaireList) {
        if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
          this.getAnswers(this.questionnaireList.labels);
        }
      }
    }
    if (this.questionnaireList) {
      // if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
      //   this.questions = this.questionnaireList.labels;
      // } else if (this.questionnaireList[0] && this.questionnaireList[0].questions && this.questionnaireList[0].questions.length > 0) {
      //   this.questions = this.questionnaireList[0].questions;
      // }
      if (this.source === 'customer-create') {
        if (this.customerDetails && this.customerDetails.questionnaire) {
          // this.questionnaireList = this.customerDetails.questionnaire;
          // this.questions = this.customerDetails.questionnaire.questionnaire;
          this.getAnswers(this.customerDetails.questionnaire.questionnaire);
        }
        this.questions = this.questionnaireList.labels[0].questions;
        
      } else {
        this.questions = this.questionnaireList.labels;
      }
    }

    console.log(this.questions);
    console.log(this.source);
    console.log(this.params.uuid);
    if (this.params.uuid) {
      this.loading = true;
      if (this.source === 'consCheckin') {
        this.getConsumerCheckinDetails();
      } else if (this.source === 'consAppt') {
        this.getConsumerApptDetails();
      } else if (this.source === 'proCheckin') {
        this.getCheckinDetailsProvider();
      } else {
        this.getApptDetailsProvider();
      }
    }
  }
  setValidateError(errors) {
    console.log(errors);
    this.apiError = [];
    if (errors.length > 0) {
for (let error of errors) {
  this.apiError[error.questionField] = [];
  this.apiError[error.questionField].push(error.error);
}
    }
    console.log(this.apiError);
  }
  getAnswers(answerData, type?) {
    if (!type) {
      for (let answ of answerData) {
        console.log(answ);
        if (answ.answer) {
          if (answ.question.fieldDataType !== 'FileUpload') {
            this.answers[answ.answer.labelName] = answ.answer.answer;
          } else {
            this.fileuploadpreAnswers[answ.answer.labelName] = answ.answer.answer;
          }
        }
      }
    } else {
      console.log(answerData);
      for (let answ of answerData) {
        this.answers[answ.labelName] = answ.answer;
      }
    }
    console.log(this.answers);
    console.log(this.fileuploadpreAnswers);
  }
  filesSelected(event, question, document?) {
    const input = event.target.files;
    console.log(question);
    console.log(document);
    this.answers[question.labelName] = {};
    if (input) {
      for (const file of input) {
        // console.log(file);
        // console.log(question);
        // console.log(question.filePropertie.fileTypes.indexOf(file.type));
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
        const indx = this.selectedMessage.files.indexOf(file);
        // console.log(indx);
        this.answers[question.labelName][indx] = (document) ? document : question.filePropertie.allowedDocuments[0];
        // console.log(this.answers[question.labelName]);
        reader.readAsDataURL(file);
        // }
      }
      console.log(this.answers);
      console.log(this.selectedMessage);
      // console.log(this.apiError);
      // console.log(this.answers);
    }
    this.onSubmit();
  }
  deleteTempImage(i, label) {
    let imgname = this.selectedMessage.files[i].name.split('.');
    imgname = imgname[0];
    // console.log(this.selectedMessage.files[i].name);
    // console.log(this.answers[label]);
    delete this.answers[label][i];
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
    // console.log(this.answers);
    this.onSubmit();
  }
  deletePreImage(i, label) {
    delete this.fileuploadpreAnswers[label][i];
    // console.log(this.fileuploadpreAnswers);
    // console.log(this.fileuploadpreAnswers[label].length);
  }
  
  onSubmit(type?) {
    console.log(this.answers);
    let data = [];
    Object.keys(this.answers).forEach(key => {
      console.log(this.answers[key]);
      if (this.answers[key]) {
        data.push({
          'labelName': key,
          'answer': this.answers[key]
        });
      }
    });
    console.log(data);
    if (data.length > 0) {
      const postData = {
        'questionnaireId': (this.questionnaireList.id) ? this.questionnaireList.id : this.questionnaireList.questionnaireId,
        'answer': data
      }
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
    console.log(ev);
    console.log(value);
    console.log(question.labelName);
    if (ev.target.checked) {
      if (!this.answers[question.labelName]) {
        this.answers[question.labelName] = [];
      }
      if (question.listPropertie.maxAnswers > 1) {
      this.answers[question.labelName].push(value);
      } else {
        this.answers[question.labelName][0] = value;
      }
    } else {
      const indx = this.answers[question.labelName].indexOf(value);
      this.answers[question.labelName].splice(indx, 1);
    }
    if (this.answers[question.labelName].length === 0) {
      delete this.answers[question.labelName];
    }
    console.log(this.answers);
    this.onSubmit();
  }
  booleanChange(ev, question) {
    console.log(ev);
    console.log(question.labelName);
    this.answers[question.labelName] = ev.target.checked;
    console.log(this.answers);
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
    // console.log(ev);
    console.log(this.answers[question.labelName]);
    // this.answers[question.labelName] = this.datepipe.transformTofilterDate(ev);
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
    this.buttonDisable = true;
    if (this.source === 'consCheckin' || this.source === 'consAppt') {
      this.validateConsumerQuestionnaire(passData.answers, dataToSend);
    } else {
      this.validateProviderQuestionnaire(passData.answers, dataToSend);
    }
  }
  resubmitConsumerWaitlistQuestionnaire(body) {
    this.sharedService.resubmitConsumerWaitlistQuestionnaire(body, this.params.uuid, this.accountId).subscribe(data => {
      this.router.navigate(['/consumer']);
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitConsumerApptQuestionnaire(body) {
    this.sharedService.resubmitConsumerApptQuestionnaire(body, this.params.uuid, this.accountId).subscribe(data => {
      this.router.navigate(['/consumer']);
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitProviderWaitlistQuestionnaire(body) {
    this.providerService.resubmitProviderWaitlistQuestionnaire(body, this.params.uuid).subscribe(data => {
      this.router.navigate(['/provider/check-ins']);
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitProviderApptQuestionnaire(body) {
    this.providerService.resubmitProviderApptQuestionnaire(body, this.params.uuid).subscribe(data => {
      this.router.navigate(['/provider/appointments']);
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  goBack() {
    this.location.back();
  }
  getConsumerCheckinDetails() {
    this.sharedService.getCheckinByConsumerUUID(this.params.uuid, this.accountId).subscribe(
      (data: any) => {
        if (data && data.questionnaire) {
          // this.questionAnswers = data.questionnaire;
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionnaire;
          this.loading = false;
          if (this.questions && this.questions.length > 0) {
            this.getAnswers(this.questions);
          }
        }
        // this.getConsumerQuestionnaire();
      });
  }
  getConsumerApptDetails() {
    this.sharedService.getAppointmentByConsumerUUID(this.params.uuid, this.accountId).subscribe(
      (data: any) => {
        if (data && data.questionnaire) {
          // this.questionAnswers = data.questionnaire;
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionnaire;
          this.loading = false;
          if (this.questions && this.questions.length > 0) {
            this.getAnswers(this.questions);
          }
        }
        // this.getConsumerQuestionnaire();
      });
  }
  getCheckinDetailsProvider() {
    this.providerService.getProviderWaitlistDetailById(this.params.uuid).subscribe(
      (data: any) => {
        if (data && data.questionnaire) {
          // this.questionAnswers = data.questionnaire;
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionnaire;
          this.loading = false;
          if (this.questions && this.questions.length > 0) {
            this.getAnswers(this.questions);
          }
        }
        // this.getProviderQuestionnaire();
      });
  }
  getApptDetailsProvider() {
    this.providerService.getAppointmentById(this.params.uuid).subscribe(
      (data: any) => {
        if (data && data.questionnaire) {
          // this.questionAnswers = data.questionnaire;
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionnaire;
          this.loading = false;
          if (this.questions && this.questions.length > 0) {
            this.getAnswers(this.questions);
          }
        }
        // this.getProviderQuestionnaire();
      });
  }
  getQuestion(question) {
    // console.log(question);
    if (this.source === 'customer-create') {
      return question;
    } else {
      return question.question;
    }
  }
  selectUploadDocuments(question, option) {
    if (!this.documentsToUpload[question]) {
      this.documentsToUpload[question] = [];
    }
    if (this.documentsToUpload[question] && this.documentsToUpload[question].indexOf(option) === -1) {
      this.documentsToUpload[question].push(option);
    }
    console.log(this.documentsToUpload);
    console.log(this.selectedDocs);
  }

  validateConsumerQuestionnaire(answers, dataToSend) {
    console.log(answers);
    this.sharedService.validateConsumerQuestionnaire(answers, this.accountId).subscribe((data: any) => {
      this.setValidateError(data);
      // this.apiError = data;
      console.log(this.apiError);
      this.buttonDisable = false;
      if (data.length === 0) {
      if (this.source === 'consCheckin') {
        this.resubmitConsumerWaitlistQuestionnaire(dataToSend);
      } else {
        this.resubmitConsumerApptQuestionnaire(dataToSend);
      }
    }
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }

  validateProviderQuestionnaire(answers, dataToSend) {
    console.log(answers);
    this.providerService.validateProviderQuestionnaire(answers).subscribe((data: any) => {
      this.setValidateError(data);
      // this.apiError = data;
      console.log(this.apiError);
      this.buttonDisable = false;
      if (data.length === 0) {
      if (this.source === 'proCheckin') {
        this.resubmitProviderWaitlistQuestionnaire(dataToSend);
      } else {
        this.resubmitProviderApptQuestionnaire(dataToSend);
      }
    }
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }

  takeDoc(doc) {
    this.show_adhar = false;
    this.show_rCard = false;
    this.docu = [];
    for(let i = 0; i < doc.length; i++) {
      console.log(doc[i]);
      this.docu.push(doc[i]);
    }
    console.log(this.docu);
    for(let j = 0; j < this.docu.length; j++) {
      console.log(this.docu[j]);
      switch(this.docu[j]) {
      
        case 'Adhar Card':
            this.show_adhar = true;
            break;
        case ' Ration Card':
            this.show_rCard = true;
            break;
      }
    }
  }
}
