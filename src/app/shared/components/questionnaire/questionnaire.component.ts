import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { SharedServices } from '../../services/shared-services';
import { SnackbarService } from '../../services/snackbar.service';
import { WordProcessor } from '../../services/word-processor.service';
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
  @Input() uuid;
  @Output() returnAnswers = new EventEmitter<any>();
  answers: any = {};
  selectedMessage: any = [];
  apiError: any = [];
  params;
  fileuploadpreAnswers: any = {};
  loading = false;
  buttonDisable = false;
  questions: any = [];
  selectedDocs: any = [];
  documentsToUpload: any = [];
  subscription: Subscription;
  uploadFilesTemp: any = [];
  filestoUpload: any = [];
  changeHappened = false;
  uploadedFiles: any = [];
  uploadedImages: any = [];
  constructor(private sharedService: SharedServices,
    private datepipe: DateFormatPipe,
    private activated_route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private sharedFunctionobj: SharedFunctions,
    private providerService: ProviderServices,
    private location: Location) {
      console.log(this.uuid);
      console.log(this.source);
    this.activated_route.queryParams.subscribe(qparams => {
      this.params = qparams;
      if (this.params.type) {
        this.source = this.params.type;
      }
      if (this.params.providerId) {
        this.accountId = this.params.providerId;
      }
      if (this.params.uuid) {
        this.uuid = this.params.uuid;
      }
      console.log(this.uuid);
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
    if (this.questionAnswers) {
      if (this.questionAnswers.files) {
        this.selectedMessage = this.questionAnswers.files;
      }
      if (this.questionAnswers.filestoUpload) {
        this.filestoUpload = this.questionAnswers.filestoUpload;
      }
      if (this.questionAnswers.answers) {
        this.getAnswers(this.questionAnswers.answers.answer, 'init');
      }
    }
    if (this.questionnaireList) {
      if (this.source === 'customer-create') {
        if (this.customerDetails && this.customerDetails[0] && this.customerDetails[0].questionnaire) {
          this.getAnswers(this.customerDetails[0].questionnaire.questionnaire);
        }
        this.questions = this.questionnaireList.labels[0].questions;

      } else if (this.source === 'qnrDetails') {
        this.questions = this.questionnaireList.questions;
      } else {
        this.questions = this.questionnaireList.labels;
      }
    }
    console.log(this.uuid);
    if (this.uuid) {
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
    this.apiError = [];
    if (errors === 'required') {
      for (let question of this.questions) {
        if (this.getQuestion(question).mandatory) {
          this.apiError[this.getQuestion(question).labelName] = [];
          this.apiError[this.getQuestion(question).labelName].push('Mandatory field');
        }
      }
    } else {
      if (errors.length > 0) {
        for (let error of errors) {
          this.apiError[error.questionField] = [];
          this.apiError[error.questionField].push(error.error);
        }
      }
    }
  }
  getAnswers(answerData, type?) {
    this.answers = new Object();
    if (!type || type === 'get') {
      this.selectedMessage = [];
      this.uploadedImages = [];
      this.uploadedFiles = [];
      for (let answ of answerData) {
        if (answ.answer) {
          if (answ.question.fieldDataType !== 'FileUpload') {
            this.answers[answ.answer.labelName] = answ.answer.answer;
          } else {
            if (answ.answer.attachment && answ.answer.attachment.length > 0) {
            for (let i = 0; i < answ.answer.attachment.length; i++) {
              if (type === 'get') {
                this.uploadedImages.push(answ.answer.attachment[i]);
                if (!this.uploadedFiles[answ.answer.labelName]) {
                  this.uploadedFiles[answ.answer.labelName] = {};
                }
                if (!this.uploadedFiles[answ.answer.labelName][answ.answer.attachment[i].caption]) {
                  this.uploadedFiles[answ.answer.labelName][answ.answer.attachment[i].caption] = {};
                }
                this.uploadedFiles[answ.answer.labelName][answ.answer.attachment[i].caption] = answ.answer.attachment[i];
              } else {
                this.selectedMessage.push(answ.answer.attachment[i]);
                if (!this.filestoUpload[answ.answer.labelName]) {
                  this.filestoUpload[answ.answer.labelName] = {};
                }
                if (!this.filestoUpload[answ.answer.labelName][answ.answer.attachment[i].caption]) {
                  this.filestoUpload[answ.answer.labelName][answ.answer.attachment[i].caption] = {};
                }
                this.filestoUpload[answ.answer.labelName][answ.answer.attachment[i].caption] = answ.answer.attachment[i];
              }
            }
          }
          }
        }
      }
    } else {
      for (let answ of answerData) {
        this.answers[answ.labelName] = answ.answer;
      }
    }
    if (type === 'get') {
      Object.keys(this.uploadedFiles).forEach(key => {
        Object.keys(this.uploadedFiles[key]).forEach(key1 => {
          if (this.uploadedFiles[key][key1]) {
            if (!this.uploadFilesTemp[key]) {
              this.uploadFilesTemp[key] = [];
            }
            this.uploadFilesTemp[key].push(key1);
          }
        });
      });
    } else {
      Object.keys(this.filestoUpload).forEach(key => {
        Object.keys(this.filestoUpload[key]).forEach(key1 => {
          if (this.filestoUpload[key][key1]) {
            if (!this.uploadFilesTemp[key]) {
              this.uploadFilesTemp[key] = [];
            }
            this.uploadFilesTemp[key].push(key1);
          }
        });
      });
    }
    this.onSubmit('getanswer');
  }
  filesSelected(event, question, document?) {
    const input = event.target.files;
    if (!document) {
      document = question.filePropertie.allowedDocuments[0];
    }
    if (!this.answers[question.labelName]) {
      this.answers[question.labelName] = {};
    }
    if (!this.filestoUpload[question.labelName]) {
      this.filestoUpload[question.labelName] = {};
    }
    if (!this.filestoUpload[question.labelName][document]) {
      this.filestoUpload[question.labelName][document] = {};
    }
    if (input) {
      for (const file of input) {
        const size = file.size / 1000;
        let type = file.type.split('/');
        type = type[1];
        this.apiError[question.labelName] = [];
        if (question.filePropertie.fileTypes.indexOf(type) === -1) {
          // this.apiError[question.labelName].push('Selected image type not supported');
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (size > question.filePropertie.maxSize) {
          // this.apiError[question.labelName].push('Please upload images with size < ' + question.filePropertie.maxSize + 'kb');
          this.snackbarService.openSnackBar('Please upload images with size < ' + question.filePropertie.maxSize + 'kb', { 'panelClass': 'snackbarerror' });
        } else {
          if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][document]) {
            const index = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][document]);
            if (index !== -1) {
              this.selectedMessage.splice(index, 1);
              delete this.filestoUpload[question.labelName][document];
              delete this.answers[question.labelName][index];
            }
          }
          this.selectedMessage.push(file);
          const indx = this.selectedMessage.indexOf(file);
          this.filestoUpload[question.labelName][document] = file;
          if (indx !== -1) {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.selectedMessage[indx]['path'] = e.target['result'];
            };
            reader.readAsDataURL(file);
          }
        }
      }
      this.onSubmit();
    }
  }
  deleteTempImage(question) {
    if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][question.filePropertie.allowedDocuments[0]]) {
      const index = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][question.filePropertie.allowedDocuments[0]]);
      if (index !== -1) {
        this.selectedMessage.splice(index, 1);
        delete this.filestoUpload[question.labelName][question.filePropertie.allowedDocuments[0]];
      }
    } else if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][question.filePropertie.allowedDocuments[0]]) {
      const index = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][question.filePropertie.allowedDocuments[0]]);
      if (index !== -1) {
        // delete this.uploadedFiles[question.labelName][question.filePropertie.allowedDocuments[0]];
        this.uploadedFiles[question.labelName][question.filePropertie.allowedDocuments[0]] = 'remove';
        this.filestoUpload[question.labelName] = {};
        this.filestoUpload[question.labelName][question.filePropertie.allowedDocuments[0]] = {};
      }
    }
    this.onSubmit();
  }
  onSubmit(type?) {
    console.log(this.changeHappened);
    console.log(this.uploadedFiles);
    console.log(this.filestoUpload);
    Object.keys(this.filestoUpload).forEach(key => {
      console.log(key);
      console.log(Object.keys(this.filestoUpload[key]).length);
      if (Object.keys(this.filestoUpload[key]).length > 0) {
        this.answers[key] = [];
        Object.keys(this.filestoUpload[key]).forEach(key1 => {
          if (this.filestoUpload[key][key1]) {
            console.log(this.filestoUpload[key][key1]);
            const indx = this.selectedMessage.indexOf(this.filestoUpload[key][key1]);
console.log(indx);
            if (indx !== -1) {
              if (this.uuid) {
                let status = 'add';
                if (this.uploadedFiles[key] && this.uploadedFiles[key][key1]) {
                  status = 'update';
                }
                this.answers[key].push({index: indx, allowedDocument: key1, status: status});
              } else {
              this.answers[key][indx] = key1;
              }
            } else {
              console.log(this.uploadedFiles[key][key1]);
              if (this.uuid && this.uploadedFiles[key] && this.uploadedFiles[key][key1] && this.uploadedFiles[key][key1] === 'remove') {
                console.log(this.uploadedFiles[key][key1]);
                this.answers[key].push({allowedDocument: key1, status: 'remove'});
              }
            }
          } else {
            console.log(this.uploadedFiles[key][key1]);
            if (this.uuid && this.uploadedFiles[key] && this.uploadedFiles[key][key1] && this.uploadedFiles[key][key1] === 'remove') {
              console.log(this.uploadedFiles[key][key1]);
              this.answers[key].push({allowedDocument: key1, status: 'remove'});
            }
          }
        });
      } else {
        // delete this.answers[key];
        console.log(this.uploadedFiles[key]);

           if (this.uuid && Object.keys(this.uploadedFiles[key]).length > 0) {
            Object.keys(this.uploadedFiles[key]).forEach(key1 => {
              if (this.uploadedFiles[key][key1] && this.uploadedFiles[key][key1] === '') {
                this.answers[key].push({allowedDocument: key1, status: 'remove'});
              }
            });
        }
        // if (Object.keys(this.uploadedFiles[key]).length === 0) {
        //   this.answers[key] = '';
        // }
      }
    });
    let data = [];
    console.log(this.answers);
    Object.keys(this.answers).forEach(key => {
      // if (this.answers[key]) {
      this.apiError[key] = [];
      data.push({
        'labelName': key,
        'answer': (this.answers[key]) ? this.answers[key] : ''
      });
      // }
    });
    if (data.length > 0) {
      const postData = {
        'questionnaireId': (this.questionnaireList.id) ? this.questionnaireList.id : this.questionnaireList.questionnaireId,
        'answer': data
      }
      const passData = { 'answers': postData, 'files': this.selectedMessage, 'filestoUpload': this.filestoUpload };
      if (type !== 'getanswer') {
        if (type) {
          if (this.changeHappened) {
            this.submitQuestionnaire(passData);
          } else {
            this.location.back();
          }
        } else {
          this.changeHappened = true;
          this.returnAnswers.emit(passData);
        }
      }
    }
  }
  getDate(date) {
    return new Date(this.datepipe.transformTofilterDate(date));
  }
  listChange(ev, value, question) {
    if (ev.target.checked) {
      if (!this.answers[question.labelName]) {
        this.answers[question.labelName] = [];
      }
      if (question.listPropertie && question.listPropertie.maxAnswers && question.listPropertie.maxAnswers > 1) {
        this.answers[question.labelName].push(value);
      } else {
        this.answers[question.labelName][0] = value;
      }
    } else {
      const indx = this.answers[question.labelName].indexOf(value);
      this.answers[question.labelName].splice(indx, 1);
    }
    if (this.answers[question.labelName].length === 0) {
      this.answers[question.labelName] = '';
    }
    this.onSubmit();
  }
  booleanChange(ev, question) {
    this.answers[question.labelName] = ev.target.checked;
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
  submitQuestionnaire(passData) {
    console.log(passData);
    const dataToSend: FormData = new FormData();
    if (passData.files && passData.files.length > 0) {
      for (let pic of passData.files) {
        dataToSend.append('files', pic);
      }
    }
    const blobpost_Data = new Blob([JSON.stringify(passData.answers)], { type: 'application/json' });
    dataToSend.append('question', blobpost_Data);
    this.buttonDisable = true;
    if (this.source === 'consCheckin' || this.source === 'consAppt') {
      this.validateConsumerQuestionnaireResubmit(passData.answers, dataToSend);
    } else {
      this.validateProviderQuestionnaireResubmit(passData.answers, dataToSend);
    }
  }
  resubmitConsumerWaitlistQuestionnaire(body) {
    this.sharedService.resubmitConsumerWaitlistQuestionnaire(body, this.uuid, this.accountId).subscribe(data => {
      this.location.back();
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitConsumerApptQuestionnaire(body) {
    this.sharedService.resubmitConsumerApptQuestionnaire(body, this.uuid, this.accountId).subscribe(data => {
      this.location.back();
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitProviderWaitlistQuestionnaire(body) {
    this.providerService.resubmitProviderWaitlistQuestionnaire(body, this.uuid).subscribe(data => {
      this.location.back();
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitProviderApptQuestionnaire(body) {
    this.providerService.resubmitProviderApptQuestionnaire(body, this.uuid).subscribe(data => {
      this.location.back();
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  goBack() {
    this.location.back();
  }
  getConsumerCheckinDetails() {
    this.sharedService.getCheckinByConsumerUUID(this.uuid, this.accountId).subscribe(
      (data: any) => {
        if (data && data.questionnaire) {
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionnaire;
          this.loading = false;
          console.log(this.questions);
          if (this.questions && this.questions.length > 0) {
            this.getAnswers(this.questions, 'get');
          }
        }
      });
  }
  getConsumerApptDetails() {
    this.sharedService.getAppointmentByConsumerUUID(this.uuid, this.accountId).subscribe(
      (data: any) => {
        if (data && data.questionnaire) {
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionnaire;
          this.loading = false;
          if (this.questions && this.questions.length > 0) {
            this.getAnswers(this.questions, 'get');
          }
        }
      });
  }
  getCheckinDetailsProvider() {
    this.providerService.getProviderWaitlistDetailById(this.uuid).subscribe(
      (data: any) => {
        if (data && data.questionnaire) {
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionnaire;
          this.loading = false;
          if (this.questions && this.questions.length > 0) {
            this.getAnswers(this.questions, 'get');
          }
        }
      });
  }
  getApptDetailsProvider() {
    this.providerService.getAppointmentById(this.uuid).subscribe(
      (data: any) => {
        if (data && data.questionnaire) {
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionnaire;
          this.loading = false;
          if (this.questions && this.questions.length > 0) {
            this.getAnswers(this.questions, 'get');
          }
        }
      });
  }
  getQuestion(question) {
    if (this.source === 'customer-create' || this.source === 'qnrDetails') {
      return question;
    } else {
      return question.question;
    }
  }
  validateProviderQuestionnaireResubmit(answers, dataToSend) {
    this.providerService.validateProviderQuestionnaireResbmit(answers).subscribe((data: any) => {
      this.setValidateError(data);
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
  validateConsumerQuestionnaireResubmit(answers, dataToSend) {
    this.sharedService.validateConsumerQuestionnaireResbumit(answers, this.accountId).subscribe((data: any) => {
      this.setValidateError(data);
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
  takeDoc(question, document) {
    if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][document]) {
      const indx = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][document]);
      if (indx !== -1) {
        this.selectedMessage.splice(indx, 1);
        delete this.filestoUpload[question.labelName][document];
      }
    } else if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][document]) {
      const indx = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][document]);
      if (indx !== -1) {
        // delete this.uploadedFiles[question.labelName][document];
        this.uploadedFiles[question.labelName][document] = 'remove';
        this.filestoUpload[question.labelName] = {};
        this.filestoUpload[question.labelName][question.filePropertie.allowedDocuments[0]] = {};
      }
    }
    this.onSubmit();
  }
  getImg(question, document) {
    if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][document]) {
      const indx = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][document]);
      if (indx !== -1) {
        const path = this.selectedMessage[indx].path;
        return path;
      } else {
        return '../../assets/images/pdf.png';
      }
    } else if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][document]) {
      const indx = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][document]);
      if (indx !== -1) {
        const path = this.uploadedImages[indx].s3path;
        return path;
      } else {
        return '../../assets/images/pdf.png';
      }
    } else {
      return '../../assets/images/pdf.png';
    }
  }
  getImgName(question) {
    if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][question.filePropertie.allowedDocuments[0]]) {
      const indx = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][question.filePropertie.allowedDocuments[0]]);
      if (indx !== -1) {
        return this.selectedMessage[indx].name;
      }
    } else if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][question.filePropertie.allowedDocuments[0]]) {
      const indx = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][question.filePropertie.allowedDocuments[0]]);
      if (indx !== -1) {
        return this.uploadedImages[indx].originalName;
      }
    }
  }
}
