import { Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @Input() type;
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
  bookingDetails: any = [];
  @ViewChild('logofile') file1: ElementRef;
  @ViewChild('logofile1') file2: ElementRef;
  constructor(private sharedService: SharedServices,
    private datepipe: DateFormatPipe,
    private activated_route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private sharedFunctionobj: SharedFunctions,
    private providerService: ProviderServices,
    private location: Location) {
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
    console.log(this.questionnaireList);
    if (this.questionnaireList) {
      if (this.source === 'customer-create') {
        this.questions = this.questionnaireList.labels[0].questions;
        if (this.customerDetails && this.customerDetails[0] && this.customerDetails[0].questionnaire) {
          this.getAnswers(this.customerDetails[0].questionnaire.questionAnswers, 'get');
        }
      } else if (this.source === 'qnrDetails') {
        this.questions = this.questionnaireList.questions;
      } else {
        this.questions = this.questionnaireList.labels;
      }
    }
    console.log(this.questions);
    console.log(this.questionAnswers);
    if (this.questionAnswers) {
      if (this.questionAnswers.files) {
        this.selectedMessage = this.questionAnswers.files;
      }
      if (this.questionAnswers.filestoUpload) {
        this.filestoUpload = this.questionAnswers.filestoUpload;
      }
      if (this.questionAnswers.answers) {
        this.getAnswers(this.questionAnswers.answers.answerLine, 'init');
      }
    }
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
    console.log(errors);
    this.apiError = [];
      if (errors.length > 0) {
        for (let error of errors) {
          this.apiError[error.questionField] = [];
          this.apiError[error.questionField].push(error.error);
        }
      }
  }
  getAnswers(answerData, type?) {
    this.answers = new Object();
    if (type === 'get') {
      this.selectedMessage = [];
      this.uploadedImages = [];
      this.uploadedFiles = [];
      for (let answ of answerData) {
        if (answ.answerLine) {
          if (answ.question.fieldDataType !== 'fileUpload') {
            this.answers[answ.answerLine.labelName] = answ.answerLine.answer[answ.question.fieldDataType];
          } else {
            if (answ.answerLine.answer && answ.answerLine.answer[answ.question.fieldDataType] && answ.answerLine.answer[answ.question.fieldDataType].length > 0) {
              for (let i = 0; i < answ.answerLine.answer[answ.question.fieldDataType].length; i++) {
                if (type === 'get') {
                  this.uploadedImages.push(answ.answerLine.answer[answ.question.fieldDataType][i]);
                  if (!this.uploadedFiles[answ.answerLine.labelName]) {
                    this.uploadedFiles[answ.answerLine.labelName] = {};
                  }
                  if (!this.uploadedFiles[answ.answerLine.labelName][answ.answerLine.answer[answ.question.fieldDataType][i].caption]) {
                    this.uploadedFiles[answ.answerLine.labelName][answ.answerLine.answer[answ.question.fieldDataType][i].caption] = {};
                  }
                  this.uploadedFiles[answ.answerLine.labelName][answ.answerLine.answer[answ.question.fieldDataType][i].caption] = answ.answerLine.answer[answ.question.fieldDataType][i];
                } else {
                  this.selectedMessage.push(answ.answerLine.answer[answ.question.fieldDataType][i]);
                  if (!this.filestoUpload[answ.answerLine.labelName]) {
                    this.filestoUpload[answ.answerLine.labelName] = {};
                  }
                  if (!this.filestoUpload[answ.answerLine.labelName][answ.answerLine.answer[answ.question.fieldDataType][i].caption]) {
                    this.filestoUpload[answ.answerLine.labelName][answ.answerLine.answer[answ.question.fieldDataType][i].caption] = {};
                  }
                  this.filestoUpload[answ.answerLine.labelName][answ.answerLine.answer[answ.question.fieldDataType][i].caption] = answ.answerLine.answer[answ.question.fieldDataType][i];
                }
              }
            }
          }
        }
      }
    } else {
      console.log(answerData);
      for (let answ of answerData) {
        this.answers[answ.labelName] = answ.answer[Object.keys(answ.answer)[0]];
      }
    }
    console.log(this.answers);
    console.log(this.uploadedFiles);
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
    this.onSubmit();
  }
  filesSelected(event, question, document?) {
    const input = event.target.files;
    if (!document) {
      document = question.filePropertie.allowedDocuments[0];
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
      console.log(this.file1);
      console.log(this.file2);
      if (this.file1 && this.file1.nativeElement.value) {
        this.file1.nativeElement.value = '';
      }
      if (this.file2 && this.file2.nativeElement.value) {
        this.file2.nativeElement.value = '';
      }
      this.onSubmit('inputChange');
    }
  }
  deleteTempImage(question) {
    if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][question.filePropertie.allowedDocuments[0]]) {
      const index = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][question.filePropertie.allowedDocuments[0]]);
      if (index !== -1) {
        this.selectedMessage.splice(index, 1);
        delete this.filestoUpload[question.labelName][question.filePropertie.allowedDocuments[0]];
      }
      console.log(Object.keys(this.filestoUpload[question.labelName]).length);
      // if (Object.keys(this.filestoUpload[question.labelName]).length === 0) {
      //   delete this.filestoUpload[question.labelName];
      // }
    } else if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][question.filePropertie.allowedDocuments[0]]) {
      const index = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][question.filePropertie.allowedDocuments[0]]);
      if (index !== -1) {
        this.uploadedFiles[question.labelName][question.filePropertie.allowedDocuments[0]] = 'remove';
      }
    }
    this.onSubmit('inputChange');
  }
  onSubmit(type?) {
    console.log(this.changeHappened);
    console.log(this.uploadedFiles);
    console.log(this.filestoUpload);
    console.log(this.selectedMessage);
    console.log(this.answers);
    Object.keys(this.filestoUpload).forEach(key => {
        if (!this.answers[key]) {
          this.answers[key] = [];
        }
        console.log(this.filestoUpload[key]);
        if (Object.keys(this.filestoUpload[key]).length > 0) {
        Object.keys(this.filestoUpload[key]).forEach(key1 => {
          console.log(this.filestoUpload[key][key1]);
          if (this.filestoUpload[key][key1]) {
            let indx = this.selectedMessage.indexOf(this.filestoUpload[key][key1]);
            if (indx !== -1) {
              let status = 'add';
              if (this.uploadedFiles[key] && this.uploadedFiles[key][key1]) {
                status = 'update';
              }
              if (this.answers[key] && this.answers[key].length > 0) {
                const filteredAnswer = this.answers[key].filter(answer => answer.caption === key1);
                console.log(filteredAnswer);
                if (filteredAnswer[0]) {
                  const index = this.answers[key].indexOf(filteredAnswer[0]);
                  console.log(index);
                  if (index !== -1) {
                    this.answers[key].splice(index, 1);
                  }
                }
              }
              this.answers[key].push({ index: indx, caption: key1, action: status });
              console.log(this.answers);
            }
          }
        });
      } else {
        delete this.answers[key];
      }
        if (this.answers[key] && this.answers[key].length === 0) {
          delete this.answers[key];
        }
    });
    console.log(this.answers);
    Object.keys(this.uploadedFiles).forEach(key => {
      if (!this.answers[key]) {
        this.answers[key] = [];
      }
      if (this.uploadedFiles[key] && Object.keys(this.uploadedFiles[key]).length > 0) {
        Object.keys(this.uploadedFiles[key]).forEach(key1 => {
          if ((!this.filestoUpload[key] || (this.filestoUpload[key] && !this.filestoUpload[key][key1])) && this.uploadedFiles[key][key1] && this.uploadedFiles[key][key1] === 'remove') {
            if (this.answers[key] && this.answers[key].length > 0) {
              const filteredAnswer = this.answers[key].filter(answer => answer.caption === key1);
              console.log(filteredAnswer);
              if (filteredAnswer[0]) {
                const index = this.answers[key].indexOf(filteredAnswer[0]);
                console.log(index);
                if (index !== -1) {
                  this.answers[key].splice(index, 1);
                }
              }
            }
            this.answers[key].push({ caption: key1, action: 'remove' });
            console.log(this.answers);
          }
        });
        if (this.answers[key].length === 0) {
          delete this.answers[key];
        }
      }
    });
    let data = [];
    console.log(this.answers);
    Object.keys(this.answers).forEach(key => {
      this.apiError[key] = [];
      let newMap = {};
      console.log(this.questions);
      const question = this.questions.filter(quest => this.getQuestion(quest).labelName === key);
      console.log(question);
      let questiontype;
      if (this.source === 'customer-create' || this.source === 'qnrDetails') {
        questiontype = question[0].fieldDataType;
      } else {
        questiontype = question[0].question.fieldDataType;
      }
      if (this.answers[key] || questiontype === 'bool') {
        newMap[questiontype] = this.answers[key];
        data.push({
          'labelName': key,
          'answer': newMap
        });
      } else {
        newMap = '';
        data.push({
          'labelName': key,
        });
      }
    });
    console.log(data);
    // if (data.length > 0) {
      const postData = {
        'questionnaireId': (this.questionnaireList.id) ? this.questionnaireList.id : this.questionnaireList.questionnaireId,
        'answerLine': data
      }
      const passData = { 'answers': postData, 'files': this.selectedMessage, 'filestoUpload': this.filestoUpload };
      console.log(type);
      if (type === 'inputChange') {
        this.changeHappened = true;
      }
        if (type === 'submit') {
          console.log(this.changeHappened);
          if (this.changeHappened) {
            this.submitQuestionnaire(passData);
          } else {
            this.location.back();
          }
        } else {
          console.log(passData);
          this.returnAnswers.emit(passData);
        }
    // }
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
    this.onSubmit('inputChange');
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
  booleanChange(ev, value, question) {
    if (ev.target.checked) {
      if (!this.answers[question.labelName]) {
        this.answers[question.labelName] = {};
      }
      this.answers[question.labelName] = (value === 'YES') ? true : false;
    }
    this.onSubmit('inputChange');
  }
  isBooleanChecked(value, question) {
    value = (value === 'YES') ? true : false;
    if (this.answers[question.labelName] === value) {
      return true;
    } else {
      return false;
    }
  }
  submitQuestionnaire(passData) {
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
        this.bookingDetails = data;
        if (data && data.questionnaire) {
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionAnswers;
          this.loading = false;
          if (this.questions && this.questions.length > 0) {
            this.getAnswers(this.questions, 'get');
          }
        }
      });
  }
  getConsumerApptDetails() {
    this.sharedService.getAppointmentByConsumerUUID(this.uuid, this.accountId).subscribe(
      (data: any) => {
        this.bookingDetails = data;
        if (data && data.questionnaire) {
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionAnswers;
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
        this.bookingDetails = data;
        if (data && data.questionnaire) {
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionAnswers;
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
        this.bookingDetails = data;
        if (data && data.questionnaire) {
          this.questionnaireList = data.questionnaire;
          this.questions = this.questionnaireList.questionAnswers;
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
    console.log(question.labelName);
    console.log(document);
    console.log(this.filestoUpload);
    console.log(this.answers);
    if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][document]) {
      const indx = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][document]);
      if (indx !== -1) {
        this.selectedMessage.splice(indx, 1);
        delete this.filestoUpload[question.labelName][document];
        if (this.answers[question.labelName] && this.answers[question.labelName].length > 0) {
          const filteredAnswer = this.answers[question.labelName].filter(answer => answer.caption === document);
          console.log(filteredAnswer);
          if (filteredAnswer[0]) {
            const index = this.answers[question.labelName].indexOf(filteredAnswer[0]);
            console.log(index);
            if (index !== -1) {
              this.answers[question.labelName].splice(index, 1);
            }
          }
        }
      }
      console.log(this.filestoUpload);
      console.log(this.answers[question.labelName].length)
      if (Object.keys(this.filestoUpload[question.labelName]).length === 0) {
        delete this.filestoUpload[question.labelName];
      }
      if (this.answers[question.labelName] && this.answers[question.labelName].length === 0) {
        delete this.answers[question.labelName];
      }
    }
    if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][document]) {
      const indx = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][document]);
      if (indx !== -1) {
        this.uploadedFiles[question.labelName][document] = 'remove';
      }
    }
    console.log(this.answers);
    console.log(this.filestoUpload);
    this.onSubmit('inputChange');
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
  disableInput() {
    if (this.bookingDetails && this.uuid) {
      if (this.source === 'consCheckin' || this.source === 'proCheckin') {
        if (this.bookingDetails.waitlistStatus !== 'checkedIn' && this.bookingDetails.waitlistStatus !== 'arrived') {
          return true;
        }
      }
      if (this.source === 'consAppt' || this.source === 'proAppt') {
        if (this.bookingDetails.apptStatus !== 'Confirmed' && this.bookingDetails.apptStatus !== 'Arrived') {
          return true;
        }
      }
    }
  }
}
