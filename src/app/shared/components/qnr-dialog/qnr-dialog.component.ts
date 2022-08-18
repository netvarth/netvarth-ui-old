
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location } from '@angular/common';
import {ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../business/services/provider-services.service';
import { SharedServices } from '../../services/shared-services';
import { SnackbarService } from '../../services/snackbar.service';
import { WordProcessor } from '../../services/word-processor.service';
import { Subscription } from 'rxjs';
import { SharedFunctions } from '../../functions/shared-functions';
import { PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image, ButtonEvent } from '@ks89/angular-modal-gallery';
// import { DateTimeProcessor } from '../../services/datetime-processor.service';
import { ShowuploadfileComponent } from '../../../business/modules/medicalrecord/uploadfile/showuploadfile/showuploadfile.component';
import { MatDialog } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../constants/project-constants';
import { FileService } from '../../services/file-service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qnr-dialog',
  templateUrl: './qnr-dialog.component.html',
  styleUrls: ['./qnr-dialog.component.css']
})
export class QnrDialogComponent implements OnInit {
  question: any;
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
  newItemArray : any =[];
  dataGridListColumn:any=[];
  basePriceList:any=[];
  priceList:any=[];
  isListChanged=false;
  items:any=[];
  selectedPriceList:any=[];
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
 dataGridListColumns: any = {};
  qnr_type: any;
  repeat_type: any;
  showQnr: boolean;
  isSecondcase = false;
  basePrice: any;
  baseArray:any =[];
  baseValues: any =[];
  priceGridList: any;
  keytype: any;
  selectedType: any;
  totalPrice: number=0;
  selectedTypeSub: any;
  closeCase = false;
  ans: {};
  answ = [];
  answersQnr={}
  answerQnr={}
  answDataGridList = {}
  answDataGridListColumn =[];
  ansdDtaGridColumnItem={};
  ansList=[];
  ansDataColumn= {};
  postData: { questionnaireId: any; answerLine: any; totalPrice :any};
  qnrId: any;
  popUpView;
  item_details: any;
  item_price: any;
  item: any;
  oldQnr;
  plainText;
  inputnumber;
  inputDate;
  selectFirst = false;
  derror: string;
  dataGridList : any=[];
  id : number = 0;
  showItem = false;
  post_Data;
  finalObjectList: any=[];
  itemArray : any = [];
  secondrror: string;
  isCheckedSecond;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<QnrDialogComponent>,
  private sharedService: SharedServices,
    private activated_route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private sharedFunctionobj: SharedFunctions,
    private providerService: ProviderServices,
    // private dateProcessor: DateTimeProcessor,
    public dialog: MatDialog,
    private fileService: FileService,
    private location: Location) { 
    
      this.qnr_type = data.qnr_type;
      if(data.repeat_type){
        this.repeat_type = data.repeat_type;
      }
     
      this.popUpView = data.view;
      if(data.item_details){
        this.item_details= data.item_details;
      }
      if(data.item_price){
        this.item_price= data.item_price;
      }
      if(data.item){
        this.item= data.item;
    
      }
      this.questionnaireList = data;
 
     this.oldQnr = data
    
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
     
        if (this.source === 'customer-create' || this.source === 'onetime') {
          if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
            this.questions = this.questionnaireList.labels[0].questions;
            this.groupQuestionsBySection();
            // this.getAnswers(this.questions, 'get');
          }
          if (this.customerDetails && this.customerDetails[0] && this.customerDetails[0].questionnaire && this.customerDetails[0].questionnaire.questionAnswers) {
            this.getAnswers(this.customerDetails[0].questionnaire.questionAnswers, 'get');
          }
        } 
       
        else if (this.qnr_type === 'service_option') {
          this.questions =  this.questionnaireList;
    if(this.repeat_type === 'repeat_type'){
    
        this.basePrice = this.questions.data.labels[0].question.dataGridListProperties.dataGridListColumns[0].listPropertie.basePrice
        this.baseValues = this.questions.data.labels[0].question.dataGridListProperties.dataGridListColumns[0].listPropertie.values
      }
      else{
       
              this.basePrice = this.questions.data.dataGridListProperties.dataGridListColumns[0].listPropertie.basePrice
            this.baseValues = this.questions.data.dataGridListProperties.dataGridListColumns[0].listPropertie.values
      }
         
          if(this.basePrice){
            let base=this.basePrice+''
            base=base.substring(1, base.length-1);
            this.baseArray=base.split(',');
          }
          if(this.repeat_type === 'repeat_type'){
    
            this.priceGridList = this.questions.data.labels[0].question.priceGridList;
          }
          else{
       
            this.priceGridList = this.questions.data.priceGridList;
    }
         
       
          this.showQnr = true;
          this.groupQuestionsBySection();
        }
       
       
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
    
     
    }
    groupQuestionsBySection() {
    
      if (this.source === 'customer-create' || this.source === 'qnrDetails' || this.source === 'onetime') {
        this.groupedQnr = this.sharedFunctionobj.groupBy(this.questions, 'sectionName');
      } 
      else if(this.qnr_type === 'service_option'){
        let qnrDummyArray=[this.questions];
        
       
        this.groupedQnr = qnrDummyArray.reduce(function (rv, x) {
          (rv[x.data['sectionOrder']] = rv[x.data['sectionOrder']] || []).push(x);
          return rv;
        }, {});
      }else {
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
    // filesSelected(event, question, document) {
    //   const input = event.target.files;
     
    //   if (input) {
    //     for (const file of input) {
    //       let type = file.type.split('/');
         
    //       this.apiError[question.labelName] = [];
    //       // if (question.filePropertie.fileTypes.indexOf(type[1]) === -1) {
    //       //   this.snackbarService.openSnackBar('Selected file type not supported', { 'panelClass': 'snackbarerror' });
    //       // } else {
  
    //       if (!this.filestoUpload[question.labelName]) {
    //         this.filestoUpload[question.labelName] = {};
    //       }
    //       if (!this.filestoUpload[question.labelName][document]) {
    //         this.filestoUpload[question.labelName][document] = {};
    //       }
    //       if (this.filestoUpload[question.labelName] && this.filestoUpload[question.labelName][document]) {
    //         let index;
    //         if (type[0] === 'application' || type[0] === 'image') {
    //           index = this.selectedMessage.indexOf(this.filestoUpload[question.labelName][document]);
    //         } else {
    //           index = this.audioVideoFiles.indexOf(this.filestoUpload[question.labelName][document]);
    //         }
    //         if (index !== -1) {
    //           if (type[0] === 'application' || type[0] === 'image') {
    //             this.selectedMessage.splice(index, 1);
    //           } else {
    //             this.audioVideoFiles.splice(index, 1);
    //           }
    //           delete this.filestoUpload[question.labelName][document];
    //           delete this.answers[question.labelName][index];
    //         }
    //       }
    //       this.filestoUpload[question.labelName][document] = file;
    //       if (type[0] === 'application' || type[0] === 'image') {
    //         this.selectedMessage.push(file);
    //         const indx = this.selectedMessage.indexOf(file);
    //         if (indx !== -1) {
    //           const reader = new FileReader();
    //           reader.onload = (e) => {
    //             this.selectedMessage[indx]['path'] = e.target['result'];
    //           };
    //           reader.readAsDataURL(file);
    //         }
    //       } else {
    //         this.audioVideoFiles.push(file);
    //         const indx = this.audioVideoFiles.indexOf(file);
    //         if (indx !== -1) {
    //           const reader = new FileReader();
    //           reader.onload = (e) => {
    //             this.audioVideoFiles[indx]['path'] = e.target['result'];
    //           };
    //           reader.readAsDataURL(file);
    //         }
    //       }
    //       // }
    //     }
    //     if (this.file2 && this.file2.nativeElement.value) {
    //       this.file2.nativeElement.value = '';
    //     }
    //     this.onSubmit('inputChange');
    //   }
    // }
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
//       Object.keys(this.filestoUpload).forEach(key => {
//       if (!this.answers[key]) {
//       this.answers[key] = [];
//       }
//       if (Object.keys(this.filestoUpload[key]).length > 0) {
//       Object.keys(this.filestoUpload[key]).forEach(key1 => {
//       if (this.filestoUpload[key][key1]) {
//       let type = this.filestoUpload[key][key1].type.split('/');
//       type = type[0];
//       let indx;
//       if (type === 'application' || type === 'image') {
//       indx = this.selectedMessage.indexOf(this.filestoUpload[key][key1]);
//       } else {
//       indx = this.audioVideoFiles.indexOf(this.filestoUpload[key][key1]);
//       }
//       if (indx !== -1) {
//       let status = 'add';
//       if (this.uploadedFiles[key] && this.uploadedFiles[key][key1]) {
//       status = 'update';
//       }
//       if (this.answers[key] && this.answers[key].length > 0) {
//       const filteredAnswer = this.answers[key].filter(answer => answer.caption === key1);
//       if (filteredAnswer[0]) {
//       const index = this.answers[key].indexOf(filteredAnswer[0]);
//       if (index !== -1) {
//       this.answers[key].splice(index, 1);
//       }
//       }
//       }
//       let type = this.filestoUpload[key][key1].type.split('/');
//       type = type[0];
//       if (type === 'application' || type === 'image') {
//       this.answers[key].push({caption: key1, action: status, mimeType: this.filestoUpload[key][key1].type, url: this.filestoUpload[key][key1].name, size: this.filestoUpload[key][key1].size, comments: this.comments[key + '=' + key1] });
//       } else {
//       this.answers[key].push({ caption: key1, action: status, mimeType: this.filestoUpload[key][key1].type, url: this.filestoUpload[key][key1].name, size: this.filestoUpload[key][key1].size, comments: this.comments[key + '=' + key1] });
//       }
//       }
//       } else {
//       if (this.answers[key] && this.answers[key].length > 0) {
//       const filteredAnswer = this.answers[key].filter(answer => answer.caption === key1);
//       if (filteredAnswer[0]) {
//       const index = this.answers[key].indexOf(filteredAnswer[0]);
//       if (index !== -1) {
//       this.answers[key].splice(index, 1);
//       }
//       }
//       }
//       }
//       });
//       } 
      
      
//       else {
//       delete this.answers[key];
//       }
//       if (this.answers[key] && this.answers[key].length === 0) {
//       delete this.answers[key];
//       }
//       });
    
//       Object.keys(this.uploadedFiles).forEach(key => {
//       if (!this.answers[key]) {
//       this.answers[key] = [];
//       }
//       if (this.uploadedFiles[key] && Object.keys(this.uploadedFiles[key]).length > 0) {
//       Object.keys(this.uploadedFiles[key]).forEach(key1 => {
//       if ((!this.filestoUpload[key] || (this.filestoUpload[key] && !this.filestoUpload[key][key1])) && this.uploadedFiles[key][key1] && this.uploadedFiles[key][key1] === 'remove') {
//       if (this.answers[key] && this.answers[key].length > 0) {
//       const filteredAnswer = this.answers[key].filter(answer => answer.caption === key1);
//       if (filteredAnswer[0]) {
//       const index = this.answers[key].indexOf(filteredAnswer[0]);
//       if (index !== -1) {
//       this.answers[key].splice(index, 1);
//       }
//       }
//       }
//       this.answers[key].push({ caption: key1, action: 'remove' });
//       }
//       });
//       if (this.answers[key].length === 0) {
//       delete this.answers[key];
//       }
//       }
//       });
     
//       let data = [];
//     
//       Object.keys(this.dataGridColumnsAnswerList).forEach(key => {
//       let newFiled = {};
//       let question = this.questions.filter(quest => this.getQuestion(quest).labelName === key);
//       question = question[0].question;
//       for (let gridAnswer of this.dataGridColumnsAnswerList[key]) {
//       let columnData = [];
//       Object.keys(gridAnswer).forEach(key1 => {
//       let newType = {};
//       if(this.qnr_type = 'service_option'){
//       const columnDetails = question.dataGridListProperties.dataGridListColumns.filter(clmn => clmn.order === JSON.parse(key1));
//       if (columnDetails[0]) {
//       const columnType = columnDetails[0].dataType;
//       newType[columnType] = gridAnswer[key1];
//       columnData.push({
//       columnId: columnDetails[0].columnId,
//       column: newType
//       });
//       }
//       }
//       else{
//       const columnDetails = question.dataGridProperties.dataGridColumns.filter(clmn => clmn.order === JSON.parse(key1));
//       if (columnDetails[0]) {
//       const columnType = columnDetails[0].dataType;
//       newType[columnType] = gridAnswer[key1];
//       columnData.push({
//       columnId: columnDetails[0].columnId,
//       column: newType
//       });
//       }
//       }
      
      
//       });
//       let newMap = {};
    
//       newMap['dataGridColumn'] = columnData;
//       if (!newFiled[question.fieldDataType]) {
//       newFiled[question.fieldDataType] = [];
//       }
//       newFiled[question.fieldDataType].push(newMap);
//       }
//       data.push({
//       'labelName': key,
//       'answer': newFiled
//       });
//       });
     
//       Object.keys(this.answers).forEach(key => {
//       this.apiError[key] = [];
//       let newMap = {};
  
//       let question = this.questions.filter(quest => this.getQuestion(quest).question.labelName === key);
   
//       if(question)
// {

//   if (this.source === 'customer-create' || this.source === 'qnrDetails' || this.source==='onetime' || this.qnr_type==='service_option') {
   
//     question = question[0];
    
//     } else {
     
//     question = question[0].question;
//     }
// }    
    
//       if (this.answers[key] || question.fieldDataType === 'bool') {
//       let answer = this.answers[key];
//       if (question.fieldDataType === 'date') {
       
//       answer = this.dateProcessor.transformToYMDFormat(answer);
//       }
//       newMap[question.fieldDataType] = answer;
//       data.push({
//       'labelName': key,
//       'answer': newMap
//       });
//       } else {
//       newMap = '';
//       data.push({
//       'labelName': key,
//       });
//       }
//       });
    
//       let postData;

//       if(this.source === 'proLeadafter'){
//         postData = {
//           'questionnaireId': (this.questionnaireList[0].id) ? this.questionnaireList[0].id : this.questionnaireList[0].questionnaireId,
//           'answerLine': data
//         }
//       }
//     else{
//      postData = {
//         'questionnaireId': (this.questionnaireList.id) ? this.questionnaireList.id : this.questionnaireList.questionnaireId,
//         'answerLine': data
//       }
//     }
  
//       const passData = { 'answers': postData, 'files': this.selectedMessage, 'audioVideo': this.audioVideoFiles, 'filestoUpload': this.filestoUpload, 'dataGridColumnsAnswerList': this.dataGridColumnsAnswerList, 'comments': this.comments };
//       if (keytype === 'inputChange') {
//         this.changeHappened = true;
//       }
//       if (keytype === 'submit') {
//         if (this.changeHappened) {
        
//           this.submitQuestionnaire(passData);
//         } else {
//           if (!this.type) {
//             this.location.back();
//           } else {
//             if (this.type === 'qnr-link') {
//               this.returnAnswers.emit('reload');
//             } else {
//               this.editQnr();
//             }
//           }
//         }
//       } else {
//         this.returnAnswers.emit(passData);
//       }
    }
    getDate(date) {
      return new Date(date);
    }
    listChange(ev, value, question, column?) {
 
      let itemPrice;
      this.selectedType = value;
      if (question.fieldDataType !== 'dataGrid') {
     
        if(Object.keys(this.answersQnr).length === 0)
        {
          
          itemPrice = this.getValue(value);
        
          if(itemPrice !== undefined){
            var itemrate: number = +itemPrice;
          }
         else{
          var itemrate = 0
         }
          this.answersQnr["labelName"]=question.labelName;
          this.answerQnr["dataGridList"]=[];
          this.answerQnr["dataGridList"].push(this.answDataGridList) 
          this.ansList.push(value);
          this.ansDataColumn["list"]=this.ansList;
          this.ansdDtaGridColumnItem["column"]=this.ansDataColumn;
          this.ansdDtaGridColumnItem["columnId"]=column.columnId;
          this.ansdDtaGridColumnItem["price"]=itemrate;
          this.ansdDtaGridColumnItem["quantity"]=1;
          this.answDataGridListColumn.push(this.ansdDtaGridColumnItem);
          this.answDataGridList["dataGridListColumn"]= this.answDataGridListColumn;
          this.answersQnr["answer"]=this.answerQnr;
         
          this.selectedPriceList.push({item:column.columnId, rate:itemrate})
     
        }
        else {
          if(column.order && column.order===1 && column.mandatory===true)
          {
          
            itemPrice = this.getValue(value);
            if(itemPrice !== undefined){
              var itemrate: number = +itemPrice;
            }
           else{
            var itemrate = 0
           }
        
            this.ansDataColumn["list"]=[value];
            this.ansdDtaGridColumnItem["column"]=this.ansDataColumn;
            this.ansdDtaGridColumnItem["columnId"]=column.columnId;
            this.ansdDtaGridColumnItem["price"]=itemrate;
            this.ansdDtaGridColumnItem["quantity"]=1;
            this.answDataGridListColumn.pop();
            this.answDataGridListColumn.push(this.ansdDtaGridColumnItem);
            this.answDataGridList["dataGridListColumn"]= this.answDataGridListColumn;
            this.answersQnr["answer"]=this.answerQnr;
            let index =this.selectedPriceList.findIndex(x=>x.item===column.columnId)
            if (index > -1) {
              this.selectedPriceList.splice(index, 1); // 2nd parameter means remove one item only
            }
            this.selectedPriceList.push({item:column.columnId, rate:itemrate})
           
          }
          else if(column.order && column.order===2 && column.mandatory===true){
          
              this.isCheckedSecond = true;
            
            this.isListChanged=true;
            itemPrice = this.getRate(value);
          var itemrate: number = +itemPrice;
            let ansDataColumn1={};
            ansDataColumn1["list"]=[value];
            let ansdDtaGridColumnItem1={};
            ansdDtaGridColumnItem1["column"]=ansDataColumn1;
            ansdDtaGridColumnItem1["columnId"]=column.columnId;
            ansdDtaGridColumnItem1["price"]=itemrate;
            ansdDtaGridColumnItem1["quantity"]=1;
            let index =this.answDataGridListColumn.findIndex(x=>x.columnId===column.columnId)
            if (index > -1) {
              this.answDataGridListColumn.splice(index, 1); // 2nd parameter means remove one item only
            }
            this.answDataGridListColumn.push(ansdDtaGridColumnItem1);
            this.answDataGridList["dataGridListColumn"]= this.answDataGridListColumn;
            this.answersQnr["answer"]=this.answerQnr;
            let index1 =this.selectedPriceList.findIndex(x=>x.item===column.columnId)
            if (index1> -1) {
              this.selectedPriceList.splice(index1, 1); // 2nd parameter means remove one item only
            }
            this.selectedPriceList.push({item:column.columnId, rate:itemrate})
          
          }
          else{
            this.isListChanged=true;
            if (ev.target.checked) {  
            this.items.push(value);

            }
            else{
              const index = this.items.indexOf(value);
              if (index > -1) {
                this.items.splice(index, 1); // 2nd parameter means remove one item only
              }
            }
            // itemPrice = this.getRates(this.items);
            // var itemrate: number = +itemPrice;
            let ansDataColumn1={};
            ansDataColumn1["list"]=this.items;
            let ansdDtaGridColumnItem1={};
            ansdDtaGridColumnItem1["column"]=ansDataColumn1;
            ansdDtaGridColumnItem1["columnId"]=column.columnId;
            ansdDtaGridColumnItem1["price"]=this.getRates(this.items);
            ansdDtaGridColumnItem1["quantity"]=1;
            let index =this.answDataGridListColumn.findIndex(x=>x.columnId===column.columnId)
            if (index > -1) {
              this.answDataGridListColumn.splice(index, 1); // 2nd parameter means remove one item only
            }
            this.answDataGridListColumn.push(ansdDtaGridColumnItem1);
            this.answDataGridList["dataGridListColumn"]= this.answDataGridListColumn;
            this.answersQnr["answer"]=this.answerQnr;
            let index1 =this.selectedPriceList.findIndex(x=>x.item===column.columnId)
            if (index1> -1) {
              this.selectedPriceList.splice(index1, 1); // 2nd parameter means remove one item only
            }
            this.selectedPriceList.push({item:column.columnId, rate:this.getRates(this.items)})
         
          }
         
        }
      
       
      } 
      else {
       
      if (ev.target.checked) {
      if (!this.dataGridListColumns[question.labelName + '=' + column.order]) {
      this.dataGridListColumns[question.labelName + '=' + column.order] = [];
      }
      this.dataGridListColumns[question.labelName + '=' + column.order].push(value);
      } else {
      const indx = this.dataGridListColumns[question.labelName + '=' + column.order].indexOf(value);
      this.dataGridListColumns[question.labelName + '=' + column.order].splice(indx, 1);
      }
      
      this.onSubmit('inputChange');
      }
       this.totalPrice = this.getTotalPrice( this.selectedPriceList)
      }
     
       
  isChecked(value, question, column?) {
   
    if (question.fieldDataType !== 'dataGrid') {
  
      if (this.answersQnr["labelName"]) {
        
        let answDataGridListColumnArray = this.answersQnr["answer"].dataGridList[0]["dataGridListColumn"];
        if (answDataGridListColumnArray ) {
      
           // let item=answDataGridListColumnArray[column.order-1]
           let item=answDataGridListColumnArray.find(x=>x.columnId===column.columnId);
          
         if(item){
          let itemList = item["column"]["list"]
            for (let listItem of itemList) {
              if (listItem === value) {
               
                this.selectFirst = true;
              
                return true;
              }
              else {
                return false;
              }
         }
        }
         else{
           return false;
         }
         
        }
        else {
          return false;
        }
      } else {
        return false;
      }
    }

    else {
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
        
          if(column.order && column.order===5){
            let itemPrice;
          
            itemPrice = this.getRate1(column.order);
            var itemrate: number = +itemPrice;
            this.isListChanged=true;
            let ansDataColumn1={};
            ansDataColumn1[column.dataType]= value;
            let ansdDtaGridColumnItem1={};
            ansdDtaGridColumnItem1["column"]=ansDataColumn1;
            ansdDtaGridColumnItem1["columnId"]=column.columnId;
            ansdDtaGridColumnItem1["price"]=itemrate;
            ansdDtaGridColumnItem1["quantity"]=1;
            let index =this.answDataGridListColumn.findIndex(x=>x.columnId===column.columnId)
            if (index > -1) {
              this.answDataGridListColumn.splice(index, 1); 
            }
            this.answDataGridListColumn.push(ansdDtaGridColumnItem1);
            this.answDataGridList["dataGridListColumn"]= this.answDataGridListColumn;
            this.answersQnr["answer"]=this.answerQnr;
            let index1 =this.selectedPriceList.findIndex(x=>x.item===column.columnId)
            if (index1> -1) {
              this.selectedPriceList.splice(index1, 1); 
            }
            this.selectedPriceList.push({item:column.columnId, rate:itemrate})
           
           }
           this.totalPrice = this.getTotalPrice( this.selectedPriceList)
          }
          isBooleanChecked(value, question, column?) {
            if(this.qnr_type = 'service_option'){
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
            if (this.dataGridListColumns[question.labelName + '=' + column.order] !== '' && typeof this.dataGridListColumns[question.labelName + '=' + column.order] === 'string') {
            this.dataGridListColumns[question.labelName + '=' + column.order] = JSON.parse(this.dataGridListColumns[question.labelName + '=' + column.order])
            }
            if (this.dataGridListColumns[question.labelName + '=' + column.order] === value) {
            return true;
            } else {
            return false;
            }
            }
            }else{
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
            
            }
    
    submitQuestionnaire(passData) {
      const dataToSend: FormData = new FormData();
      // if (passData.files && passData.files.length > 0) {
      //   for (let pic of passData.files) {
      //     let type = pic.type.split('/');
      //     type = type[0];
      //     if (type === 'application' || type === 'image') {
      //       dataToSend.append('files', pic['name']);
      //     }
      //   }
      // }
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
    resubmitProviderLeadQuestionnaire(body) {
      this.providerService.resubmitProviderLeadQuestionnaire(body, this.uuid).subscribe(data => {
        this.uploadAudioVideo(data, 'proLead');
      }, error => {
        this.buttonDisable = false;
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
    }
    submitProviderLeadQuestionnaire(body) {
      this.providerService.submitProviderLeadQuestionnaire(body, this.uuid).subscribe(data => {
        this.uploadAudioVideo(data, 'proLead');
      }, error => {
        this.buttonDisable = false;
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
    }
    resubmitProviderLeadafterQuestionnaire(body) {
      this.providerService.resubmitProviderLeadafterQuestionnaire(body, this.uuid).subscribe(data => {
        this.uploadAudioVideo(data, 'proLeadafter');
      }, error => {
        this.buttonDisable = false;
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
    }
    submitProviderLeadafterQuestionnaire(body) {
      this.providerService.submitProviderLeadafterQuestionnaire(body, this.uuid).subscribe(data => {
        this.uploadAudioVideo(data, 'proLeadafter');
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
                else if (type === 'proLead') {
                  this.providerService.providerLeadQnrUploadStatusUpdate(this.uuid, postData)
                    .subscribe((data) => {
                      this.successGoback();
                    },
                      error => {
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                        this.buttonDisable = false;
                      });
                }
                else if (type === 'proLeadafter') {
                  this.providerService.providerLeadQnrafterUploadStatusUpdate(this.uuid, postData)
                    .subscribe((data) => {
                      this.successGoback();
                    },
                      error => {
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                        this.buttonDisable = false;
                      });
                }
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
      }  else if(this.qnr_type=== 'service_option') {
       
        return question.data;
      }
      else {
       
        return question.question;
      }
    }
  getValue(item) {
   
    for (let itemPrice of this.baseArray) {
      let itemRate = itemPrice + '';
      if (itemRate.includes(item)) {
        let rate = itemRate.split(':');
        if(!this.basePriceList.find(x => x.item === item.trim()))
        {
          this.basePriceList.push({item:item.trim(),rate:rate[1]});
        }
        return rate[1]
      }
    }
  } 
  getRate(item) {
  
    if(this.priceList.length===0||!this.isListChanged){

    for(let itemType of Object.keys(JSON.parse(this.priceGridList))){
      if(itemType === this.selectedType + ''){
        let priceGridSubList=JSON.parse(this.priceGridList)[itemType];
      
        let priceSubKeys=Object.values(priceGridSubList);
       
        for(let keys of priceSubKeys){
         
          let price = keys[item.trim()]
 
          if(price !== undefined){
            if(!this.priceList.find(x => x.item === item.trim()))
            {
              this.priceList.push({item:item.trim(),rate:price});
            }
            return price
          }
        }
      }
    }
  }
  else{
  
   
    let price=this.priceList.find(x => x.item === item.trim())
   
    return price.rate;
  }
  }
  getRate1(data_order) {
  
    for(let itemType of Object.keys(JSON.parse(this.priceGridList))){
      if(itemType === this.selectedType + ''){
        let priceGridSubList=JSON.parse(this.priceGridList)[itemType];
        let priceSubKeys=Object.values(priceGridSubList);
        return priceSubKeys[data_order-2]
     
      }
    }
  
   
  }
  getRates(items)
  {
    var itemrate: number = 0;
  
    for(let item of items)
    {
      let price=this.priceList.find(x => x.item === item.trim())
      
      itemrate = itemrate+price.rate;
     
    }
    return itemrate;
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
          else if (this.source === 'proLead') {
            if (this.qnrStatus === 'submitted') {
              this.resubmitProviderLeadQuestionnaire(dataToSend);
            } else {
              this.submitProviderLeadQuestionnaire(dataToSend);
            }
          }
          else if (this.source === 'proLeadafter') {
            if (this.qnrStatus === 'submitted') {
              this.resubmitProviderLeadafterQuestionnaire(dataToSend);
            } else {
              this.submitProviderLeadafterQuestionnaire(dataToSend);
            }
          }
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
          // if (type[1] === 'pdf' || type[1] === 'docx' || type[1] === 'txt' || type[1] === 'doc') {
          //   path = 'assets/images/pdf.png';
          // } else if (type[0] === 'video') {
          //   path = 'assets/images/video.png';
          // } else if (type[0] === 'audio') {
          //   path = 'assets/images/audio.png';
          // } else {
            path = file[indx].path;
          // }
          return path;
        }
      } else if (this.uploadedFiles[question.labelName] && this.uploadedFiles[question.labelName][document]) {
        const indx = this.uploadedImages.indexOf(this.uploadedFiles[question.labelName][document]);
        if (indx !== -1) {
          // let path;
          // let type = this.uploadedImages[indx].type.split('/');
          
          // if (type[1] === 'pdf' || type[1] === 'docx' || type[1] === 'txt' || type[1] === 'doc') {
          //   path = 'assets/images/pdf.png';
          // } else if (this.uploadedImages[indx].status === 'COMPLETE' && type[0] === 'video') {
          //   path = 'assets/images/video.png';
          // } else if (this.uploadedImages[indx].status === 'COMPLETE' && type[0] === 'audio') {
          //   path = 'assets/images/audio.png';
          // } else {
            let path = this.fileService.getImage(null, this.uploadedImages[indx]);
  
          if (path && path !== null) {
            return path;
          }
            path = this.uploadedImages[indx].s3path;
          // }
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
      this.showQnr =true;
      this.showDataGrid[question.labelName] = value;
      this.updatedGridIndex[question.labelName] = null;
    }
    saveDataGridColumn() {
    
      if(!this.selectFirst){
      
        setTimeout(() => {
          this.derror = 'Please select an item';
        }, 300)
        
       
        this.isSecondcase = false;
      }else{
         this.selectFirst = true;
         
        this.derror = '';
        if(this.isSecondcase){
          if(this.isCheckedSecond){
            this.isCheckedSecond = true;
            this.closeDialog();
           }
           else if (this.isCheckedSecond === undefined){
            this.isCheckedSecond = false;
            this.secondrror = 'Mandotory field';
           }
         
        }
        this.isSecondcase = true;
      }
      
    
    }
    closeDialog() {
      this.postData = {
        'questionnaireId': this.qnrId,
        'answerLine': [this.answersQnr],
        'totalPrice': this.totalPrice
      }
      this.dialogRef.close({data:this.postData});
    }
    closeDialogg() {
      this.dialogRef.close();
    }
    closeDialogPopup(){
      this.dialogRef.close();
    }
    editDataGrid(question, column) {
      if(this.qnr_type = 'service_option'){
        const index = this.dataGridColumnsAnswerList[question.labelName].indexOf(column);
        Object.keys(column).forEach(key => {
        this.dataGridListColumns[question.labelName + '=' + key] = column[key];
        });
        this.updatedGridIndex[question.labelName] = index;
        this.showDataGrid[question.labelName] = true;
        } else{
        const index = this.dataGridColumnsAnswerList[question.labelName].indexOf(column);
        Object.keys(column).forEach(key => {
        this.dataGridColumns[question.labelName + '=' + key] = column[key];
        });
        this.updatedGridIndex[question.labelName] = index;
        this.showDataGrid[question.labelName] = true;
        }
    }
    deleteDataGrid(question, column) {
      const index = this.dataGridColumnsAnswerList[question.labelName].indexOf(column);
      this.dataGridColumnsAnswerList[question.labelName].splice(index, 1);
      this.onSubmit('inputChange');
    }
    cancelAddorUpdate(question) {
      this.showDataGrid[question.labelName] = false;
      this.updatedGridIndex[question.labelName] = null;
      if(this.qnr_type = 'service_option'){
      for (let column of question.dataGridListProperties.dataGridListColumns) {
      this.dataGridListColumns[question.labelName + '=' + column.order] = '';
      } 
      }
      else{
      for (let column of question.dataGridProperties.dataGridColumns) {
      this.dataGridColumns[question.labelName + '=' + column.order] = '';
      }
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
  getTotalPrice(selectedItems: []){
  
    this.totalPrice = 0;
  for ( let item of selectedItems){
  
   this.totalPrice = this.totalPrice + item["rate"];
    // this.totalPrice = this.totalPrice + item.price
  }
    return this.totalPrice
  }
  repeatSame(repeatingItem){
    this.dialogRef.close({repeatItem:repeatingItem});
  }
  addNew(){
    this.dialogRef.close('addNew');
  }
  qnrPopup() {
    this.dialogRef.close();
    const removeitemdialogRef = this.dialog.open(QnrDialogComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
        data : this.oldQnr.data,
        qnr_type : 'service_option',
        repeat_type : 'repeat_type',
        view : 'qnrView'
        }
    });
    removeitemdialogRef.afterClosed().subscribe(result => {
    
        if (result) {
        
          this.dataGridList = result.data.answerLine;
          this.post_Data =  result.data;
          this.showItem = true;
          this.item = result.data.answerLine[0].answer.dataGridList[0].dataGridListColumn[0].column.list[0];
        
          if(result.data.totalPrice){
            this.totalPrice = result.data.totalPrice
          }
            let dummyArray = {id: this.id  ,item:  this.item, price : this.totalPrice, columnItem : this.dataGridList}
            this.itemArray.push(dummyArray)
            this.id = this.id+1
          let obj={dgList: this.post_Data.answerLine};
          this.finalObjectList.push(obj);
          this.onSubmit('serviceOption')
         
        }
    });
}
changesApplied(ev, question, column?){
 
   if(column.order && column.order===2){
    let itemPrice;
  
    itemPrice = this.getRate1(column.order);
    var itemrate: number = +itemPrice;
    this.isListChanged=true;
    let ansDataColumn1={};
    ansDataColumn1[column.dataType]=this.plainText;
    let ansdDtaGridColumnItem1={};
    ansdDtaGridColumnItem1["column"]=ansDataColumn1;
    ansdDtaGridColumnItem1["columnId"]=column.columnId;
    ansdDtaGridColumnItem1["price"]=itemrate;
    ansdDtaGridColumnItem1["quantity"]=1;
    let index =this.answDataGridListColumn.findIndex(x=>x.columnId===column.columnId)
    if (index > -1) {
      this.answDataGridListColumn.splice(index, 1); 
    }
    this.answDataGridListColumn.push(ansdDtaGridColumnItem1);
    this.answDataGridList["dataGridListColumn"]= this.answDataGridListColumn;
    this.answersQnr["answer"]=this.answerQnr;
    let index1 =this.selectedPriceList.findIndex(x=>x.item===column.columnId)
    if (index1> -1) {
      this.selectedPriceList.splice(index1, 1); 
    }
    this.selectedPriceList.push({item:column.columnId, rate:itemrate})
   }
   else if(column.order && column.order===3){
    let itemPrice;
  
    itemPrice = this.getRate1(column.order);
    var itemrate: number = +itemPrice;
    this.isListChanged=true;
    let ansDataColumn1={};
    ansDataColumn1[column.dataType]=this.inputnumber;
    let ansdDtaGridColumnItem1={};
    ansdDtaGridColumnItem1["column"]=ansDataColumn1;
    ansdDtaGridColumnItem1["columnId"]=column.columnId;
    ansdDtaGridColumnItem1["price"]=itemrate;
    ansdDtaGridColumnItem1["quantity"]=1;
    let index =this.answDataGridListColumn.findIndex(x=>x.columnId===column.columnId)
    if (index > -1) {
      this.answDataGridListColumn.splice(index, 1); 
    }
    this.answDataGridListColumn.push(ansdDtaGridColumnItem1);
    this.answDataGridList["dataGridListColumn"]= this.answDataGridListColumn;
    this.answersQnr["answer"]=this.answerQnr;
    let index1 =this.selectedPriceList.findIndex(x=>x.item===column.columnId)
    if (index1> -1) {
      this.selectedPriceList.splice(index1, 1); 
    }
    this.selectedPriceList.push({item:column.columnId, rate:itemrate})
  
   }
   else if(column.order && column.order===4){
    let itemPrice;
  
    itemPrice = this.getRate1(column.order);
    var itemrate: number = +itemPrice;
    this.isListChanged=true;
    let ansDataColumn1={};
    ansDataColumn1[column.dataType]=this.inputDate;
    let ansdDtaGridColumnItem1={};
    ansdDtaGridColumnItem1["column"]=ansDataColumn1;
    ansdDtaGridColumnItem1["columnId"]=column.columnId;
    ansdDtaGridColumnItem1["price"]=itemrate;
    ansdDtaGridColumnItem1["quantity"]=1;
    let index =this.answDataGridListColumn.findIndex(x=>x.columnId===column.columnId)
    if (index > -1) {
      this.answDataGridListColumn.splice(index, 1); 
    }
    this.answDataGridListColumn.push(ansdDtaGridColumnItem1);
    this.answDataGridList["dataGridListColumn"]= this.answDataGridListColumn;
    this.answersQnr["answer"]=this.answerQnr;
    let index1 =this.selectedPriceList.findIndex(x=>x.item===column.columnId)
    if (index1> -1) {
      this.selectedPriceList.splice(index1, 1); 
    }
    this.selectedPriceList.push({item:column.columnId, rate:itemrate})
  
   }
   this.totalPrice = this.getTotalPrice( this.selectedPriceList)
  
}
filesSelected(event) {
 
  const input = event.target.files;
  
  if (input) {
    for (const file of input) {
      if (projectConstantsLocal.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
        this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
      } else if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
        this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
      } else {
        
        this.selectedMessage.files.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedMessage.base64.push(e.target['result']);
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
getImage(url, file) {
  return this.fileService.getImage(url, file);
}
deleteTempImage(i) {
  this.selectedMessage.files.splice(i, 1);
  this.selectedMessage.base64.splice(i, 1);
  this.selectedMessage.caption.splice(i, 1);
  // selectedMessageCoApplicant
}
  }



  