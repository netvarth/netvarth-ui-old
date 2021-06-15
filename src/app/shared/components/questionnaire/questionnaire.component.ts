import { Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedServices } from '../../services/shared-services';
import { SnackbarService } from '../../services/snackbar.service';
import { WordProcessor } from '../../services/word-processor.service';
import { Subscription } from 'rxjs';
import { SharedFunctions } from '../../functions/shared-functions';
import { PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image, ButtonEvent } from '@ks89/angular-modal-gallery';
import { Messages } from '../../constants/project-messages';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
import { ShowuploadfileComponent } from '../../../business/modules/medicalrecord/uploadfile/showuploadfile/showuploadfile.component';
import { MatDialog } from '@angular/material/dialog';

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
  @Input() donationDetails;
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
  @ViewChild('logofile1') file2: ElementRef;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'fa fa-download',
        type: ButtonType.DOWNLOAD,
        ariaLabel: 'custom close aria label',
        title: 'Download',
        fontSize: '20px'
      },
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };
  image_list_popup: Image[];
  questionnaire_heading = '';
  customer_label = '';
  editQuestionnaire = false;
  audioVideoFiles: any = [];
  constructor(private sharedService: SharedServices,
    private activated_route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private sharedFunctionobj: SharedFunctions,
    private providerService: ProviderServices,
    private dateProcessor: DateTimeProcessor,
    public dialog: MatDialog,
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
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
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
    if (this.source === 'customer-details') {
      this.questionnaireList = this.customerDetails[0].questionnaire;
      this.questions = this.customerDetails[0].questionnaire.questionAnswers;
      this.getAnswers(this.customerDetails[0].questionnaire.questionAnswers, 'get');
    }
    if (this.questionAnswers) {
      if (this.questionAnswers.files) {
        this.selectedMessage = this.questionAnswers.files;
      }
      if (this.questionAnswers.audioVideo) {
        this.audioVideoFiles = this.questionAnswers.audioVideo;
      }
      if (this.questionAnswers.filestoUpload) {
        this.filestoUpload = this.questionAnswers.filestoUpload;
      }
      if (this.questionAnswers.answers) {
        this.getAnswers(this.questionAnswers.answers.answerLine, 'init');
      }
    }
    if (this.donationDetails) {
      this.questionnaireList = this.donationDetails.questionnaire;
      this.questions = this.questionnaireList.questionAnswers;
      if (this.questions && this.questions.length > 0) {
        this.getAnswers(this.questions, 'get');
      }
    }
    if (this.uuid) {
      this.loading = true;
      this.getWaitlistDetails();
    }
  }
  getWaitlistDetails() {
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
  setValidateError(errors) {
    this.apiError = [];
    if (errors.length > 0) {
      for (let error of errors) {
        this.apiError[error.questionField] = [];
        this.apiError[error.questionField].push(error.error);
      }
      this.buttonDisable = false;
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
      for (let answ of answerData) {
        this.answers[answ.labelName] = answ.answer[Object.keys(answ.answer)[0]];
      }
    }
    if (type === 'get') {
      Object.keys(this.uploadedFiles).forEach(key => {
        Object.keys(this.uploadedFiles[key]).forEach(key1 => {
          if (this.uploadedFiles[key][key1]) {
            if (!this.uploadFilesTemp[key]) {
              this.uploadFilesTemp[key] = [];
            }
            const type = this.uploadedFiles[key][key1].type.split('/');
            if (type[0] !== 'audio' && type[0] !== 'video' || ((type[0] === 'audio' || type[0] === 'video') && this.uploadedFiles[key][key1].status === 'COMPLETE')) {
              this.uploadFilesTemp[key].push(key1);
            }
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
  filesSelected(event, question, document) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        let type = file.type.split('/');
        this.apiError[question.labelName] = [];
        console.log(type);
        console.log(question.filePropertie.fileTypes);
        if (question.filePropertie.fileTypes.indexOf(type[1]) === -1) {
          this.snackbarService.openSnackBar('Selected file type not supported', { 'panelClass': 'snackbarerror' });
        } else {
          if (!this.filestoUpload[question.labelName]) {
            this.filestoUpload[question.labelName] = {};
          }
          if (!this.filestoUpload[question.labelName][document]) {
            this.filestoUpload[question.labelName][document] = {};
          }
          if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][document]) {
            let index;
            if (type[0] === 'application' || type[0] === 'image') {
              index = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][document]);
            } else {
              index = this.audioVideoFiles.indexOf(this.filestoUpload[question.labelName][document]);
            }
            if (index !== -1) {
              if (type[0] === 'application' || type[0] === 'image') {
                this.selectedMessage.splice(index, 1);
              } else {
                this.audioVideoFiles.splice(index, 1);
              }
              delete this.filestoUpload[question.labelName][document];
              delete this.answers[question.labelName][index];
            }
          }
          this.filestoUpload[question.labelName][document] = file;
          if (type[0] === 'application' || type[0] === 'image') {
            this.selectedMessage.push(file);
            const indx = this.selectedMessage.indexOf(file);
            if (indx !== -1) {
              const reader = new FileReader();
              reader.onload = (e) => {
                this.selectedMessage[indx]['path'] = e.target['result'];
              };
              reader.readAsDataURL(file);
            }
          } else {
            this.audioVideoFiles.push(file);
            const indx = this.audioVideoFiles.indexOf(file);
            if (indx !== -1) {
              const reader = new FileReader();
              reader.onload = (e) => {
                this.audioVideoFiles[indx]['path'] = e.target['result'];
              };
              reader.readAsDataURL(file);
            }
          }
        }
      }
      if (this.file2 && this.file2.nativeElement.value) {
        this.file2.nativeElement.value = '';
      }
      this.onSubmit('inputChange');
    }
  }
  changeImageSelected(question, document) {
    if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][document]) {
      let type = this.filestoUpload[question.labelName][document].type.split('/');
      type = type[0];
      let index;
      if (type === 'application' || type === 'image') {
        index = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][document]);
      } else {
        index = this.audioVideoFiles.indexOf(this.filestoUpload[question.labelName][document]);
      }
      if (index !== -1) {
        if (type === 'application' || type === 'image') {
          this.selectedMessage.splice(index, 1);
        } else {
          this.audioVideoFiles.splice(index, 1);
        }
        delete this.filestoUpload[question.labelName][document];
        if (this.answers[question.labelName] && this.answers[question.labelName].length > 0) {
          const filteredAnswer = this.answers[question.labelName].filter(answer => answer.caption === document);
          if (filteredAnswer[0]) {
            const index = this.answers[question.labelName].indexOf(filteredAnswer[0]);
            if (index !== -1) {
              this.answers[question.labelName].splice(index, 1);
            }
          }
        }
      }
      if (Object.keys(this.filestoUpload[question.labelName]).length === 0) {
        delete this.filestoUpload[question.labelName];
      }
      if (this.answers[question.labelName] && this.answers[question.labelName].length === 0) {
        delete this.answers[question.labelName];
      }
    } else if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][document]) {
      const index = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][document]);
      if (index !== -1) {
        this.uploadedFiles[question.labelName][document] = 'remove';
      }
    }
    this.onSubmit('inputChange');
  }
  onSubmit(keytype?) {
    Object.keys(this.filestoUpload).forEach(key => {
      if (!this.answers[key]) {
        this.answers[key] = [];
      }
      if (Object.keys(this.filestoUpload[key]).length > 0) {
        Object.keys(this.filestoUpload[key]).forEach(key1 => {
          if (this.filestoUpload[key][key1]) {
            let type = this.filestoUpload[key][key1].type.split('/');
            type = type[0];
            let indx;
            if (type === 'application' || type === 'image') {
              indx = this.selectedMessage.indexOf(this.filestoUpload[key][key1]);
            } else {
              indx = this.audioVideoFiles.indexOf(this.filestoUpload[key][key1]);
            }
            if (indx !== -1) {
              let status = 'add';
              if (this.uploadedFiles[key] && this.uploadedFiles[key][key1]) {
                status = 'update';
              }
              if (this.answers[key] && this.answers[key].length > 0) {
                const filteredAnswer = this.answers[key].filter(answer => answer.caption === key1);
                if (filteredAnswer[0]) {
                  const index = this.answers[key].indexOf(filteredAnswer[0]);
                  if (index !== -1) {
                    this.answers[key].splice(index, 1);
                  }
                }
              }
              let type = this.filestoUpload[key][key1].type.split('/');
              type = type[0];
              if (type === 'application' || type === 'image') {
                this.answers[key].push({ index: indx, caption: key1, action: status, size: this.filestoUpload[key][key1].size });
              } else {
                this.answers[key].push({ caption: key1, action: status, mimeType: this.filestoUpload[key][key1].type, url: this.filestoUpload[key][key1].name, size: this.filestoUpload[key][key1].size });
              }
            }
          } else {
            if (this.answers[key] && this.answers[key].length > 0) {
              const filteredAnswer = this.answers[key].filter(answer => answer.caption === key1);
              if (filteredAnswer[0]) {
                const index = this.answers[key].indexOf(filteredAnswer[0]);
                if (index !== -1) {
                  this.answers[key].splice(index, 1);
                }
              }
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
    Object.keys(this.uploadedFiles).forEach(key => {
      if (!this.answers[key]) {
        this.answers[key] = [];
      }
      if (this.uploadedFiles[key] && Object.keys(this.uploadedFiles[key]).length > 0) {
        Object.keys(this.uploadedFiles[key]).forEach(key1 => {
          if ((!this.filestoUpload[key] || (this.filestoUpload[key] && !this.filestoUpload[key][key1])) && this.uploadedFiles[key][key1] && this.uploadedFiles[key][key1] === 'remove') {
            if (this.answers[key] && this.answers[key].length > 0) {
              const filteredAnswer = this.answers[key].filter(answer => answer.caption === key1);
              if (filteredAnswer[0]) {
                const index = this.answers[key].indexOf(filteredAnswer[0]);
                if (index !== -1) {
                  this.answers[key].splice(index, 1);
                }
              }
            }
            this.answers[key].push({ caption: key1, action: 'remove' });
          }
        });
        if (this.answers[key].length === 0) {
          delete this.answers[key];
        }
      }
    });
    let data = [];
    Object.keys(this.answers).forEach(key => {
      this.apiError[key] = [];
      let newMap = {};
      const question = this.questions.filter(quest => this.getQuestion(quest).labelName === key);
      let questiontype;
      if (this.source === 'customer-create' || this.source === 'qnrDetails') {
        questiontype = question[0].fieldDataType;
      } else {
        questiontype = question[0].question.fieldDataType;
      }
      if (this.answers[key] || questiontype === 'bool') {
        let answer = this.answers[key];
        if (questiontype === 'date') {
          answer = this.dateProcessor.transformToYMDFormat(answer);
        }
        newMap[questiontype] = answer;
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
    const postData = {
      'questionnaireId': (this.questionnaireList.id) ? this.questionnaireList.id : this.questionnaireList.questionnaireId,
      'answerLine': data
    }
    const passData = { 'answers': postData, 'files': this.selectedMessage, 'audioVideo': this.audioVideoFiles, 'filestoUpload': this.filestoUpload };
    if (keytype === 'inputChange') {
      this.changeHappened = true;
    }
    if (keytype === 'submit') {
      if (this.changeHappened) {
        this.submitQuestionnaire(passData);
      } else {
        if (!this.type) {
          this.location.back();
        } else {
          this.editQnr();
        }
      }
    } else {
      this.returnAnswers.emit(passData);
    }
  }
  getDate(date) {
    return new Date(date);
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
      this.answers[question.labelName] = (value.toLowerCase() === 'yes') ? true : false;
    }
    this.onSubmit('inputChange');
  }
  isBooleanChecked(value, question) {
    value = (value.toLowerCase() === 'yes') ? true : false;
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
        let type = pic.type.split('/');
        type = type[0];
        if (type === 'application' || type === 'image') {
          dataToSend.append('files', pic);
        }
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
  updateConsumerQnr(dataToSend) {
    this.providerService.resubmitProviderCustomerQuestionnaire(this.customerDetails[0].id, dataToSend).subscribe(data => {
      this.editQnr();
      this.snackbarService.openSnackBar('Updated Successfully');
      this.buttonDisable = false;
    }, error => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.buttonDisable = false;
    });
  }
  resubmitConsumerWaitlistQuestionnaire(body) {
    this.sharedService.resubmitConsumerWaitlistQuestionnaire(body, this.uuid, this.accountId).subscribe(data => {
      this.uploadAudioVideo(data, 'consCheckin');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitConsumerApptQuestionnaire(body) {
    this.sharedService.resubmitConsumerApptQuestionnaire(body, this.uuid, this.accountId).subscribe(data => {
      this.uploadAudioVideo(data, 'consAppt');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitProviderWaitlistQuestionnaire(body) {
    this.providerService.resubmitProviderWaitlistQuestionnaire(body, this.uuid).subscribe(data => {
      this.uploadAudioVideo(data, 'proCheckin');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitProviderApptQuestionnaire(body) {
    this.providerService.resubmitProviderApptQuestionnaire(body, this.uuid).subscribe(data => {
      this.uploadAudioVideo(data, 'proAppt');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitDonationQuestionnaire(body) {
    this.sharedService.resubmitProviderDonationQuestionnaire(this.donationDetails.uid, body).subscribe(data => {
      this.editQnr();
      this.snackbarService.openSnackBar('Updated Successfully');
      this.buttonDisable = false;
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  uploadAudioVideo(data, type) {
    if (data.urls && data.urls.length > 0) {
      let postData = {
        urls: []
      };
      for (const url of data.urls) {
        const file = this.filestoUpload[url.labelName][url.document];
        this.providerService.videoaudioS3Upload(file, url.url)
          .subscribe(() => {
            postData['urls'].push({ uid: url.uid, labelName: url.labelName });
            if (data.urls.length === postData['urls'].length) {
              if (type === 'consCheckin') {
                this.sharedService.consumerWaitlistQnrUploadStatusUpdate(this.uuid, this.accountId, postData)
                  .subscribe((data) => {
                    this.successGoback();
                  },
                    error => {
                      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                      this.buttonDisable = false;
                    });
              } else if (type === 'consAppt') {
                this.sharedService.consumerApptQnrUploadStatusUpdate(this.uuid, this.accountId, postData)
                  .subscribe((data) => {
                    this.successGoback();
                  },
                    error => {
                      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                      this.buttonDisable = false;
                    });
              } else if (type === 'proCheckin') {
                this.providerService.providerWaitlistQnrUploadStatusUpdate(this.uuid, postData)
                  .subscribe((data) => {
                    this.successGoback();
                  },
                    error => {
                      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                      this.buttonDisable = false;
                    });
              } else {
                this.providerService.providerApptQnrUploadStatusUpdate(this.uuid, postData)
                  .subscribe((data) => {
                    this.successGoback();
                  },
                    error => {
                      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                      this.buttonDisable = false;
                    });
              }
            }
          },
            error => {
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
              this.buttonDisable = false;
            });
      }
    } else {
      this.successGoback();
    }
  }
  goBack() {
    this.location.back();
  }
  getConsumerCheckinDetails() {
    this.questionnaire_heading = Messages.QUESTIONNAIRE_CONSUMER_HEADING;
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
    this.questionnaire_heading = Messages.QUESTIONNAIRE_CONSUMER_HEADING;
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
    this.questionnaire_heading = this.customer_label + ' info';
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
    this.questionnaire_heading = this.customer_label + ' info';
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
      if (data.length === 0) {
        if (this.source === 'customer-details') {
          this.updateConsumerQnr(dataToSend);
        } else if (this.source === 'proDonation') {
          this.resubmitDonationQuestionnaire(dataToSend);
        } else if (this.source === 'proCheckin') {
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
  getImg(question, document) {
    if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][document]) {
      let type = this.filestoUpload[question.labelName][document].type.split('/');
      let file;
      if (type[0] === 'video' || type[0] === 'audio') {
        file = this.audioVideoFiles;
      } else {
        file = this.selectedMessage;
      }
      const indx = file.indexOf(this.filestoUpload[question.labelName][document]);
      if (indx !== -1) {
        let path;
        if (type[1] === 'pdf' || type[1] === 'docx' || type[1] === 'txt' || type[1] === 'doc') {
          path = 'assets/images/pdf.png';
        } else if (type[0] === 'video') {
          path = 'assets/images/video.png';
        } else if (type[0] === 'audio') {
          path = 'assets/images/audio.png';
        } else {
          path = file[indx].path;
        }
        return path;
      }
    } else if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][document]) {
      const indx = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][document]);
      if (indx !== -1) {
        let path;
        let type = this.uploadedImages[indx].type.split('/');
        type = type[0];
        if (this.uploadedImages[indx].type === '.pdf' || this.uploadedImages[indx].type === '.docx' || this.uploadedImages[indx].type === '.txt' || this.uploadedImages[indx].type === '.doc') {
          path = 'assets/images/pdf.png';
        } else if (this.uploadedImages[indx].status === 'COMPLETE' && type === 'video') {
          path = 'assets/images/video.png';
        } else if (this.uploadedImages[indx].status === 'COMPLETE' && type === 'audio') {
          path = 'assets/images/audio.png';
        } else {
          path = this.uploadedImages[indx].s3path;
        }
        return path;
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
    if (this.source === 'consDonationDetails' || this.source === 'qnrDetails' || (this.type && !this.editQuestionnaire)) {
      return true;
    }
  }
  showEditBtn() {
    if (this.type) {
      if (this.source === 'consCheckin' || this.source === 'proCheckin') {
        if (this.bookingDetails.waitlistStatus !== 'checkedIn' && this.bookingDetails.waitlistStatus !== 'arrived') {
          return false;
        }
      }
      if (this.source === 'consAppt' || this.source === 'proAppt') {
        if (this.bookingDetails.apptStatus !== 'Confirmed' && this.bookingDetails.apptStatus !== 'Arrived') {
          return false;
        }
      }
      return true;
    }
  }
  onButtonBeforeHook(event: ButtonEvent) {
    if (!event || !event.button) {
      return;
    }
    if (event.button.type === ButtonType.DOWNLOAD) {
    }
  }
  onButtonAfterHook() { }
  openAttachmentGallery(question, document) {
    this.image_list_popup = [];
    let count = 0;
    let imagePath;
    if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][document]) {
      let type = this.filestoUpload[question.labelName][document].type.split('/');
      if (type[0] === 'video' || type[0] === 'audio') {
        const indx = this.audioVideoFiles.indexOf(this.filestoUpload[question.labelName][document]);
        this.showAudioVideoFile(this.audioVideoFiles[indx]);
      } else {
        const indx = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][document]);
        if (indx !== -1) {
          console.log(type);
          console.log(this.uploadedFiles[question.labelName][document]);
          if (type[1] === '.pdf' || type[1] === '.docx' || type[1] === '.txt' || type[1] === '.doc') {
            window.open(this.uploadedFiles[question.labelName][document].path, '_blank');
          } else {
            imagePath = this.uploadedImages[indx].path;
          }
        }
      }
    } else if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][document]) {
      const indx = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][document]);
      let type = this.uploadedFiles[question.labelName][document].type.split('/');
      type = type[0];
      if (indx !== -1) {
        if (type === 'video' || type === 'audio') {
          this.showAudioVideoFile(this.uploadedImages[indx]);
        } else if (type === '.pdf' || type === '.docx' || type === '.txt' || type === '.doc') {
          window.open(this.uploadedFiles[question.labelName][document].s3path, '_blank');
        } else {
          imagePath = this.uploadedImages[indx].s3path;
        }
      }
    }
    if (imagePath) {
      const imgobj = new Image(
        count,
        {
          img: imagePath
        },
      );
      this.image_list_popup.push(imgobj);
      count++;
    }
    if (count > 0) {
      setTimeout(() => {
        this.openImageModalRow(this.image_list_popup[0]);
      }, 200);
    }
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  showAudioVideoFile(file) {
    const fileviewdialogRef = this.dialog.open(ShowuploadfileComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'uploadfilecomponentclass'],
      disableClose: true,
      data: {
        file: file,
        source: 'qnr'
      }
    });
    fileviewdialogRef.afterClosed().subscribe(result => {
    });
  }
  editQnr() {
    this.editQuestionnaire = !this.editQuestionnaire;
  }
  getDocuments(question) {
    if (question.filePropertie.maxNoOfFile > 1) {
      return this.uploadFilesTemp[question.labelName];
    } else {
      return question.filePropertie.allowedDocuments;
    }
  }
  showProviderText(question) {
    if (question.whoCanAnswer && question.whoCanAnswer === 'PROVIDER_ONLY') {
      return true;
    }
  }
  successGoback() {
    this.buttonDisable = false;
    if (!this.type) {
      this.location.back();
    } else {
      this.filestoUpload = [];
      this.getWaitlistDetails();
      this.editQnr();
      this.snackbarService.openSnackBar('Updated Successfully');
    }
  }
}
