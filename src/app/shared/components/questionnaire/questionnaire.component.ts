import { Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../business/services/provider-services.service';
import { SharedServices } from '../../services/shared-services';
import { SnackbarService } from '../../services/snackbar.service';
import { WordProcessor } from '../../services/word-processor.service';
import { Subscription } from 'rxjs';
import { SharedFunctions } from '../../functions/shared-functions';
import { PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image, ButtonEvent } from '@ks89/angular-modal-gallery';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
import { ShowuploadfileComponent } from '../../../business/modules/medicalrecord/uploadfile/showuploadfile/showuploadfile.component';
import { MatDialog } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../constants/project-constants';
import { FileService } from '../../services/file-service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class QuestionnaireComponent implements OnInit {
  @Input() questionnaireList;
  @Input() source;
  @Input() accountId;
  @Input() questionAnswers;
  @Input() customerDetails;
  @Input() uuid;
  @Input() type;
  @Input() waitlistStatus;
  @Input() orderStatus;

  @Input() donationDetails;
  @Output() returnAnswers = new EventEmitter<any>();
  answers: any = {};
  showDataGrid: any = {};
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
  groupedQnr: any = [];
  dataGridColumns: any = {};
  dataGridColumnsAnswerList: any = [];
  updatedGridIndex = {};
  newTimeDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  qnrStatus = '';
  comments = {};
  tday = new Date();
  minday = new Date(1900, 0, 1);
  constructor(private sharedService: SharedServices,
    private activated_route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private sharedFunctionobj: SharedFunctions,
    private providerService: ProviderServices,
    private dateProcessor: DateTimeProcessor,
    public dialog: MatDialog,
    private fileService: FileService,
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
    console.log("questionnaireList :", this.questionnaireList);
    if (this.questionnaireList) {
      if (this.source === 'customer-create' || this.source === 'onetime') {
        if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
          this.questions = this.questionnaireList.labels[0].questions;
          this.groupQuestionsBySection();
          // this.getAnswers(this.questions, 'get');
        }
        if (this.customerDetails && this.customerDetails[0] && this.customerDetails[0].questionnaire && this.customerDetails[0].questionnaire.questionAnswers) {
          this.getAnswers(this.customerDetails[0].questionnaire.questionAnswers, 'get');
        }
      } else if (this.source === 'qnrDetails') {
        this.questions = this.questionnaireList.questions;
        this.groupQuestionsBySection();
      }
      // else if (this.source === 'proLead') {
      //   this.questions = this.questionnaireList.labels;

      //   this.groupQuestionsBySection();
      // }
      // else if (this.source === 'proLeadafter') {
      //   this.questions = this.questionnaireList[0].labels;

      //   this.groupQuestionsBySection();
      // }
      else if (!this.uuid) {

        this.questions = this.questionnaireList.labels;
        this.groupQuestionsBySection();
      } else if (this.source === 'qnrView') {
        this.questions = this.questionnaireList.labels;
        this.groupQuestionsBySection();
      }
    }
    if (this.source === 'customer-details' && this.customerDetails[0] && this.customerDetails[0].questionnaire) {
      this.questionnaireList = this.customerDetails[0].questionnaire;
      this.questions = this.customerDetails[0].questionnaire.questionAnswers;
      this.groupQuestionsBySection();
      this.getAnswers(this.questions, 'get');
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
      if (this.questionAnswers.dataGridColumnsAnswerList) {
        this.dataGridColumnsAnswerList = this.questionAnswers.dataGridColumnsAnswerList;
      }
      if (this.questionAnswers.comments) {
        this.comments = this.questionAnswers.comments;
      }
      if (this.questionAnswers.answers) {
        this.getAnswers(this.questionAnswers.answers.answerLine, 'init');
      }
    }
    if (this.donationDetails && this.donationDetails.questionnaire) {
      this.questionnaireList = this.donationDetails.questionnaire;
      this.questions = this.questionnaireList.questionAnswers;
      this.groupQuestionsBySection();
      if (this.questions && this.questions.length > 0) {
        this.getAnswers(this.questions, 'get');
      }
    }
    if (this.uuid) {

      if (this.questionnaireList.questionAnswers) {
        this.questions = this.questionnaireList.questionAnswers;
        this.qnrStatus = 'submitted';
        this.groupQuestionsBySection();
        console.log("Sequence :", this.groupedQnr);
      } else {
        this.questions = this.questionnaireList.labels;
        this.qnrStatus = 'released';
        this.groupQuestionsBySection();
      }
      if (this.questions && this.questions.length > 0) {
        this.getAnswers(this.questions, 'get');
      }
    }
  }
  // *.component.ts
asIsOrder(a, b) {
  return 1;
}
  groupQuestionsBySection() {
    if (this.source === 'customer-create' || this.source === 'qnrDetails' || this.source === 'onetime') {
      this.groupedQnr = this.sharedFunctionobj.groupBy(this.questions, 'sectionName');
    } 
    else if(this.source === 'proLead') {     
      this.groupedQnr = this.questions.reduce(function (rv, x) {
        (rv[x.question['sequnceId']] = rv[x.question['sequnceId']] || []).push(x);
        return rv;
      }, {});
    } else {
      // this.groupedQnr = this.questions.reduce(function (rv, x) {
      //   (rv[x.question['sectionName']] = rv[x.question['sectionName']] || []).push(x);
      //   return rv;
      // }, {});
      this.groupedQnr = this.questions.reduce(function (rv, x) {
        (rv[x.question['sectionOrder']] = rv[x.question['sectionOrder']] || []).push(x);
        return rv;
      }, {});
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
    this.dataGridColumns = {};
    if (type === 'get') {
      this.selectedMessage = [];
      this.uploadedImages = [];
      this.uploadedFiles = [];
      for (let answ of answerData) {

        if (answ.answerLine) {
          if (answ.question.fieldDataType === 'fileUpload') {
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
                  this.comments[answ.answerLine.labelName + '=' + answ.answerLine.answer[answ.question.fieldDataType][i].caption] = answ.answerLine.answer[answ.question.fieldDataType][i].comments;
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
          } else if (answ.question.fieldDataType === 'dataGrid') {
            for (let row of answ.answerLine.answer[answ.question.fieldDataType]) {
              let columns = [];
              for (let i = 0; i < row.dataGridColumn.length; i++) {
                columns[i + 1] = row.dataGridColumn[i].column[Object.keys(row.dataGridColumn[i].column)[0]];
              }
              if (!this.dataGridColumnsAnswerList[answ.answerLine.labelName]) {
                this.dataGridColumnsAnswerList[answ.answerLine.labelName] = [];
              }
              this.dataGridColumnsAnswerList[answ.answerLine.labelName].push(columns);
            }
          } else {
            this.answers[answ.answerLine.labelName] = answ.answerLine.answer[answ.question.fieldDataType];
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
        this.uploadFilesTemp[key] = [];
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
        // }
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
        this.comments[question.labelName + '=' + document] = '';
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
        this.comments[question.labelName + '=' + document] = '';
      }
    }
    this.onSubmit('inputChange');
  }
  isNumeric(evt) {
    return this.sharedFunctionobj.isNumeric(evt);
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
                this.answers[key].push({ caption: key1, action: status, mimeType: this.filestoUpload[key][key1].type, url: this.filestoUpload[key][key1].name, size: this.filestoUpload[key][key1].size, comments: this.comments[key + '=' + key1] });
              } else {
                this.answers[key].push({ caption: key1, action: status, mimeType: this.filestoUpload[key][key1].type, url: this.filestoUpload[key][key1].name, size: this.filestoUpload[key][key1].size, comments: this.comments[key + '=' + key1] });
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
    Object.keys(this.dataGridColumnsAnswerList).forEach(key => {
      let newFiled = {};
      let question = this.questions.filter(quest => this.getQuestion(quest).labelName === key);
      question = question[0].question;
      for (let gridAnswer of this.dataGridColumnsAnswerList[key]) {
        let columnData = [];
        Object.keys(gridAnswer).forEach(key1 => {
          let newType = {};
          const columnDetails = question.dataGridProperties.dataGridColumns.filter(clmn => clmn.order === JSON.parse(key1));
          if (columnDetails[0]) {
            const columnType = columnDetails[0].dataType;
            newType[columnType] = gridAnswer[key1];
            columnData.push({
              columnId: columnDetails[0].columnId,
              column: newType
            });
          }
        });
        let newMap = {};
        newMap['dataGridColumn'] = columnData;
        if (!newFiled[question.fieldDataType]) {
          newFiled[question.fieldDataType] = [];
        }
        newFiled[question.fieldDataType].push(newMap);
      }
      data.push({
        'labelName': key,
        'answer': newFiled
      });
    });

    Object.keys(this.answers).forEach(key => {
      this.apiError[key] = [];
      let newMap = {};
      let question = this.questions.filter(quest => this.getQuestion(quest).labelName === key);
      if (this.source === 'customer-create' || this.source === 'qnrDetails' || this.source === 'onetime') {
        question = question[0];
      } else {
        question = question[0].question;
      }
      if (this.answers[key] || question.fieldDataType === 'bool') {
        let answer = this.answers[key];
        if (question.fieldDataType === 'date') {
          answer = this.dateProcessor.transformToYMDFormat(answer);
        }
        newMap[question.fieldDataType] = answer;
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
    console.log(this.questionnaireList[0]);
    let postData;
    // if (this.source === 'proLeadafter') {
    //   postData = {
    //     'questionnaireId': (this.questionnaireList[0].id) ? this.questionnaireList[0].id : this.questionnaireList[0].questionnaireId,
    //     'answerLine': data
    //   }
    // }
    // else {
      postData = {
        'questionnaireId': (this.questionnaireList.id) ? this.questionnaireList.id : this.questionnaireList.questionnaireId,
        'answerLine': data
      }
    // }
    console.log("Postdata:", postData);
    const passData = { 'answers': postData, 'files': this.selectedMessage, 'audioVideo': this.audioVideoFiles, 'filestoUpload': this.filestoUpload, 'dataGridColumnsAnswerList': this.dataGridColumnsAnswerList, 'comments': this.comments };
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
          if (this.type === 'qnr-link') {
            this.returnAnswers.emit('reload');
          } else {
            this.editQnr();
          }
        }
      }
    } else {
      this.returnAnswers.emit(passData);
    }
  }
  getDate(date) {
    return new Date(date);
  }
  listChange(ev, value, question, column?) {
    if (question.fieldDataType !== 'dataGrid') {
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
    } else {
      if (ev.target.checked) {
        if (!this.dataGridColumns[question.labelName + '=' + column.order]) {
          this.dataGridColumns[question.labelName + '=' + column.order] = [];
        }
        this.dataGridColumns[question.labelName + '=' + column.order].push(value);
      } else {
        const indx = this.dataGridColumns[question.labelName + '=' + column.order].indexOf(value);
        this.dataGridColumns[question.labelName + '=' + column.order].splice(indx, 1);
      }
    }
    this.onSubmit('inputChange');
  }
  isChecked(value, question, column?) {
    if (question.fieldDataType !== 'dataGrid') {
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
    } else {
      if (this.dataGridColumns[question.labelName + '=' + column.order]) {
        const indx = this.dataGridColumns[question.labelName + '=' + column.order].indexOf(value);
        if (indx !== -1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  booleanChange(ev, value, question, column?) {
    if (question.fieldDataType !== 'dataGrid') {
      if (ev.target.checked) {
        if (!this.answers[question.labelName]) {
          this.answers[question.labelName] = {};
        }
        this.answers[question.labelName] = (value.toLowerCase() === 'yes') ? true : false;
      }
    } else {
      if (ev.target.checked) {
        this.dataGridColumns[question.labelName + '=' + column.order] = (value === 'yes') ? true : false;
      }
    }
    this.onSubmit('inputChange');
  }
  isBooleanChecked(value, question, column?) {
    value = (value.toLowerCase() === 'yes') ? true : false;
    if (question.fieldDataType !== 'dataGrid') {
      if (this.answers[question.labelName] !== '' && typeof this.answers[question.labelName] === 'string') {
        this.answers[question.labelName] = JSON.parse(this.answers[question.labelName])
      }
      if (this.answers[question.labelName] === value) {
        return true;
      } else {
        return false;
      }
    } else {
      if (this.dataGridColumns[question.labelName + '=' + column.order] !== '' && typeof this.dataGridColumns[question.labelName + '=' + column.order] === 'string') {
        this.dataGridColumns[question.labelName + '=' + column.order] = JSON.parse(this.dataGridColumns[question.labelName + '=' + column.order])
      }
      if (this.dataGridColumns[question.labelName + '=' + column.order] === value) {
        return true;
      } else {
        return false;
      }
    }
  }
  submitQuestionnaire(passData) {
    const dataToSend: FormData = new FormData();
    const blobpost_Data = new Blob([JSON.stringify(passData.answers)], { type: 'application/json' });
    dataToSend.append('question', blobpost_Data);
    this.buttonDisable = true;
    if (this.source === 'consCheckin' || this.source === 'consAppt' || this.source === 'consOrder' || this.source === 'consDonationDetails') {
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
  submitConsumerWaitlistQuestionnaire(body) {
    this.sharedService.submitConsumerWaitlistQuestionnaire(body, this.uuid, this.accountId).subscribe(data => {
      this.uploadAudioVideo(data, 'consCheckin');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  submitConsumerDonationQuestionnaire(body) {
    this.sharedService.submitConsumerWaitlistQuestionnaire(body, this.uuid, this.accountId).subscribe(data => {
      this.uploadAudioVideo(data, 'consDonationDetails');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitConsumerDonationQuestionnaire(body) {
    this.sharedService.resubmitConsumerDonationQuestionnaire(body, this.uuid, this.accountId).subscribe(data => {
      this.uploadAudioVideo(data, 'consDonationDetails');
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
  submitConsumerApptQuestionnaire(body) {
    this.sharedService.submitConsumerApptQuestionnaire(body, this.uuid, this.accountId).subscribe(data => {
      this.uploadAudioVideo(data, 'consAppt');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitConsumerOrderQuestionnaire(body) {
    this.sharedService.resubmitConsumerOrderQuestionnaire(body, this.uuid, this.accountId).subscribe(data => {
      this.uploadAudioVideo(data, 'consOrder');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  submitConsumerOrderQuestionnaire(body) {
    this.sharedService.submitConsumerOrderQuestionnaire(body, this.uuid, this.accountId).subscribe(data => {
      this.uploadAudioVideo(data, 'consOrder');
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
  submitProviderWaitlistQuestionnaire(body) {
    this.providerService.submitProviderWaitlistQuestionnaire(body, this.uuid).subscribe(data => {
      this.uploadAudioVideo(data, 'proCheckin');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  // resubmitProviderLeadQuestionnaire(body) {
  //   this.providerService.resubmitProviderLeadQuestionnaire(body, this.uuid).subscribe(data => {
  //     this.uploadAudioVideo(data, 'proLead');
  //   }, error => {
  //     this.buttonDisable = false;
  //     this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
  //   });
  // }
  // submitProviderLeadQuestionnaire(body) {
  //   this.providerService.submitProviderLeadQuestionnaire(body, this.uuid).subscribe(data => {
  //     this.uploadAudioVideo(data, 'proLead');
  //   }, error => {
  //     this.buttonDisable = false;
  //     this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
  //   });
  // }
  // resubmitProviderLeadafterQuestionnaire(body) {
  //   this.providerService.resubmitProviderLeadafterQuestionnaire(body, this.uuid).subscribe(data => {
  //     this.uploadAudioVideo(data, 'proLeadafter');
  //   }, error => {
  //     this.buttonDisable = false;
  //     this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
  //   });
  // }
  // submitProviderLeadafterQuestionnaire(body) {
  //   this.providerService.submitProviderLeadafterQuestionnaire(body, this.uuid).subscribe(data => {
  //     this.uploadAudioVideo(data, 'proLeadafter');
  //   }, error => {
  //     this.buttonDisable = false;
  //     this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
  //   });
  // }
  resubmitProviderApptQuestionnaire(body) {
    this.providerService.resubmitProviderApptQuestionnaire(body, this.uuid).subscribe(data => {
      this.uploadAudioVideo(data, 'proAppt');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  submitProviderApptQuestionnaire(body) {
    this.providerService.submitProviderApptQuestionnaire(body, this.uuid).subscribe(data => {
      this.uploadAudioVideo(data, 'proAppt');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitProviderOrderQuestionnaire(body) {
    this.providerService.resubmitProviderOrderQuestionnaire(body, this.uuid).subscribe(data => {
      this.uploadAudioVideo(data, 'proOrder');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  submitProviderOrderQuestionnaire(body) {
    this.providerService.submitProviderOrderQuestionnaire(body, this.uuid).subscribe(data => {
      this.uploadAudioVideo(data, 'proOrder');
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  resubmitDonationQuestionnaire(body) {
    this.sharedService.resubmitProviderDonationQuestionnaire(this.donationDetails.uid, body).subscribe(data => {
      this.successGoback();
    }, error => {
      this.buttonDisable = false;
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  submitDonationQuestionnaire(body) {
    this.sharedService.submitDonationQuestionnaire(this.donationDetails.uid, body, this.accountId).subscribe(data => {
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
              }
              // else if (type === 'proLead') {
              //   this.providerService.providerLeadQnrUploadStatusUpdate(this.uuid, postData)
              //     .subscribe((data) => {
              //       this.successGoback();
              //     },
              //       error => {
              //         this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
              //         this.buttonDisable = false;
              //       });
              // }
              // else if (type === 'proLeadafter') {
              //   this.providerService.providerLeadQnrafterUploadStatusUpdate(this.uuid, postData)
              //     .subscribe((data) => {
              //       this.successGoback();
              //     },
              //       error => {
              //         this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
              //         this.buttonDisable = false;
              //       });
              // }
              else if (type === 'consOrder') {
                this.sharedService.consumerOrderQnrUploadStatusUpdate(this.uuid, this.accountId, postData)
                  .subscribe((data) => {
                    this.successGoback();
                  },
                    error => {
                      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                      this.buttonDisable = false;
                    });
              }
              else if (type === 'consDonationDetails') {
                this.sharedService.consumerDonationQnrUploadStatusUpdate(this.uuid, this.accountId, postData)
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
              }
              else if (type === 'proOrder') {
                this.providerService.providerOrderQnrUploadStatusUpdate(this.uuid, postData)
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
  getQuestion(question) {
    if (this.source === 'customer-create' || this.source === 'qnrDetails' || this.source === 'onetime') {
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
          if (this.qnrStatus === 'submitted') {
            this.resubmitProviderWaitlistQuestionnaire(dataToSend);
          } else {
            this.submitProviderWaitlistQuestionnaire(dataToSend);
          }
        }
        // else if (this.source === 'proLead') {
        //   if (this.qnrStatus === 'submitted') {
        //     this.resubmitProviderLeadQuestionnaire(dataToSend);
        //   } else {
        //     this.submitProviderLeadQuestionnaire(dataToSend);
        //   }
        // }
        // else if (this.source === 'proLeadafter') {
        //   if (this.qnrStatus === 'submitted') {
        //     this.resubmitProviderLeadafterQuestionnaire(dataToSend);
        //   } else {
        //     this.submitProviderLeadafterQuestionnaire(dataToSend);
        //   }
        // }
        else if (this.source === 'proOrder') {
          if (this.qnrStatus === 'submitted') {
            this.resubmitProviderOrderQuestionnaire(dataToSend);
          } else {
            this.submitProviderOrderQuestionnaire(dataToSend);
          }
        } else {
          if (this.qnrStatus === 'submitted') {
            this.resubmitProviderApptQuestionnaire(dataToSend);
          } else {
            this.submitProviderApptQuestionnaire(dataToSend);
          }
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
          if (this.qnrStatus === 'submitted') {
            this.resubmitConsumerWaitlistQuestionnaire(dataToSend);
          } else {
            this.submitConsumerWaitlistQuestionnaire(dataToSend);
          }
        } else if (this.source === 'consAppt') {
          if (this.qnrStatus === 'submitted') {
            this.resubmitConsumerApptQuestionnaire(dataToSend);
          } else {
            this.submitConsumerApptQuestionnaire(dataToSend);
          }
        }
        else if (this.source === 'consOrder') {
          if (this.qnrStatus === 'submitted') {
            this.resubmitConsumerOrderQuestionnaire(dataToSend);
          } else {
            this.submitConsumerOrderQuestionnaire(dataToSend);
          }
        }
        else {
          if (this.qnrStatus === 'submitted') {
            this.resubmitConsumerDonationQuestionnaire(dataToSend);
          } else {
            this.submitConsumerDonationQuestionnaire(dataToSend);
          }
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
        let path = this.fileService.getImage(null, this.filestoUpload[question.labelName][document]);

        if (path && path !== null) {
          return path;
        }
        path = file[indx].path;
        return path;
      }
    } else if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][document]) {
      const indx = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][document]);
      if (indx !== -1) {
        let path = this.fileService.getImage(null, this.uploadedImages[indx]);
        if (path && path !== null) {
          return path;
        }
        path = this.uploadedImages[indx].s3path;
        return path;
      }
    }
  }
  disableInput() {
    if (this.uuid) {
      if (this.source === 'consCheckin' || this.source === 'proCheckin') {
        if (this.waitlistStatus !== 'checkedIn' && this.waitlistStatus !== 'arrived' && this.waitlistStatus !== 'done' && this.waitlistStatus !== 'started' && this.waitlistStatus !== 'cancelled') {
          return true;
        }
      }
      if (this.source === 'consAppt' || this.source === 'proAppt') {
        if (this.waitlistStatus !== 'Confirmed' && this.waitlistStatus !== 'Arrived' && this.waitlistStatus !== 'Started' && this.waitlistStatus !== 'Completed' && this.waitlistStatus !== 'Cancelled') {
          return true;
        }
      }
      if (this.source === 'consOrder' || this.source === 'proOrder') {
        if (this.waitlistStatus !== 'Order Confirmed' && this.waitlistStatus !== 'Order Received') {
          return true;
        }
      }
    }
    if (this.source === 'consDonationDetails' || this.source === 'qnrDetails' || this.source === 'qnrView' || (this.type && this.type !== 'qnr-link' && !this.editQuestionnaire)) {
      return true;
    }
  }
  showEditBtn() {
    if (this.type && this.type !== 'qnr-link') {
      if (this.source === 'consCheckin' || this.source === 'proCheckin') {
        if (this.waitlistStatus !== 'checkedIn' && this.waitlistStatus !== 'arrived') {
          return false;
        }
      }
      if (this.source === 'consAppt' || this.source === 'proAppt') {
        if (this.waitlistStatus !== 'Confirmed' && this.waitlistStatus !== 'Arrived') {
          return false;
        }
      }
      if (this.source === 'consOrder' || this.source === 'proOrder') {
        if (this.waitlistStatus !== 'Order Confirmed' && this.waitlistStatus !== 'Order Received') {
          return false;
        }

      }
      if (this.source === 'consDonationDetails' || this.source === 'qnrDetails' || this.source === 'qnrView' || (this.type && this.type !== 'qnr-link' && !this.editQuestionnaire)) {
        return false;
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
  openAttachmentGallery(question, document) {
    this.image_list_popup = [];
    let count = 0;
    let imagePath;
    let caption = '';
    if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][document]) {
      let type = this.filestoUpload[question.labelName][document].type.split('/');
      if (type[0] === 'video' || type[0] === 'audio') {
        const indx = this.audioVideoFiles.indexOf(this.filestoUpload[question.labelName][document]);
        this.showAudioVideoFile(this.audioVideoFiles[indx]);
      } else {
        const indx = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][document]);
        if (indx !== -1) {
          if (type[1] === 'pdf' || type[1] === 'docx' || type[1] === 'txt' || type[1] === 'doc') {
            window.open(this.selectedMessage[indx].path, '_blank');
          } else {
            imagePath = this.uploadedImages[indx].path;
            caption = this.comments[question.labelName + '=' + document];
          }
        }
      }
    } else if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][document]) {
      const indx = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][document]);
      let type = this.uploadedFiles[question.labelName][document].type.split('/');
      let ext = type[1];
      type = type[0];
      if (indx !== -1) {
        if (type === 'video' || type === 'audio') {
          this.showAudioVideoFile(this.uploadedImages[indx]);
        } else if (ext === 'pdf' || ext === 'docx' || ext === 'txt' || ext === 'doc') {
          window.open(this.uploadedFiles[question.labelName][document].s3path, '_blank');
        } else {
          imagePath = this.uploadedImages[indx].s3path;
          caption = this.uploadedImages[indx].comments;
        }
      }
    }
    if (imagePath) {
      const imgobj = new Image(
        count,
        {
          img: imagePath,
          description: caption
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
    if (question.filePropertie.maxNoOfFile > 1 && question.filePropertie.minNoOfFile !== question.filePropertie.maxNoOfFile) {
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
      this.editQnr();
      this.returnAnswers.emit('reload');
      if (this.type !== 'qnr-link') {
        this.snackbarService.openSnackBar('Updated Successfully');
      }
    }
  }
  showDataGridAddSection(question, value) {
    this.showDataGrid[question.labelName] = value;
    this.updatedGridIndex[question.labelName] = null;
  }
  saveDataGridColumn(question) {
    let columns = [];
    for (let column of question.dataGridProperties.dataGridColumns) {
      if (this.dataGridColumns[question.labelName + '=' + column.order] || column.dataType === 'bool') {
        columns[column.order] = this.dataGridColumns[question.labelName + '=' + column.order];
      } else {
        if (column.dataType === 'list' || column.dataType === 'fileUpload') {
          columns[column.order] = [];
        } else {
          columns[column.order] = '';
        }
      }
    }
    if (!this.dataGridColumnsAnswerList[question.labelName]) {
      this.dataGridColumnsAnswerList[question.labelName] = [];
    }
    if (this.updatedGridIndex[question.labelName] !== null) {
      this.dataGridColumnsAnswerList[question.labelName][this.updatedGridIndex[question.labelName]] = columns;
    } else {
      this.dataGridColumnsAnswerList[question.labelName].push(columns);
    }
    this.cancelAddorUpdate(question);
    this.onSubmit('inputChange');
  }
  editDataGrid(question, column) {
    const index = this.dataGridColumnsAnswerList[question.labelName].indexOf(column);
    Object.keys(column).forEach(key => {
      this.dataGridColumns[question.labelName + '=' + key] = column[key];
    });
    this.updatedGridIndex[question.labelName] = index;
    this.showDataGrid[question.labelName] = true;
  }
  deleteDataGrid(question, column) {
    const index = this.dataGridColumnsAnswerList[question.labelName].indexOf(column);
    this.dataGridColumnsAnswerList[question.labelName].splice(index, 1);
    this.onSubmit('inputChange');
  }
  cancelAddorUpdate(question) {
    this.showDataGrid[question.labelName] = false;
    this.updatedGridIndex[question.labelName] = null;
    for (let column of question.dataGridProperties.dataGridColumns) {
      this.dataGridColumns[question.labelName + '=' + column.order] = '';
    }
  }
  getColumnType(columns, column) {
    const columnDetails = columns.filter(clmn => clmn.order === JSON.parse(column));
    if (columnDetails[0]) {
      return columnDetails[0].dataType;
    }
  }
  getSectionCount() {
    return Object.keys(this.groupedQnr).length;
  }
  getBoolValue(value) {
    value = (value !== '' && typeof value === 'string') ? JSON.parse(value) : value;
    if (value === true) {
      return 'Yes';
    }
    if (value === false) {
      return 'No';
    }
  }
  getMaxdate(data) {
    let date;

    if (this.getQuestion(data).dateProperties && this.getQuestion(data).dateProperties.endDate) {
      const dt = this.reverse(this.getQuestion(data).dateProperties.endDate);
      date = new Date(dt)
    } else {
      date = this.tday;
    }
    return date;
  }
  getMindate(data) {
    let date;
    if (this.getQuestion(data).dateProperties && this.getQuestion(data).dateProperties.startDate) {
      const dt = this.reverse(this.getQuestion(data).dateProperties.startDate);
      date = new Date(dt)
    } else {
      date = this.minday;
    }

    return date;
  }
  reverse(s) {
    // date.split("/").reverse().join("-");
    return s.split("-").reverse().join("-");
  }
}

