import { Component, HostListener, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileService } from '../../../../shared/services/file-service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import * as moment from 'moment';


@Component({
  selector: 'app-item-options',
  templateUrl: './item-options.component.html',
  styleUrls: ['./item-options.component.css']
})
export class ItemOptionsComponent implements OnInit {
  itemData: any;
  questions: any;
  labels: any;
  timeType: any = 1;
  questionsLength: any;
  selectedCategory: any;
  answers: any = {};
  basePriceList: any;
  priceGridList: any;
  totalPrice: any;
  itemPrice: any;
  qnrId: any;
  selectedFiles = {};
  questionnaireAnswers: any = [];
  filesToUpload: any = [];
  boolTypeValues: any = [
    {
      "name": "Yes",
      "value": true
    },
    {
      "name": "No",
      "value": false
    }
  ];
  itemOptionsData: any;
  type: any;
  itemDetails: any;
  lastCustomization: any;
  constructor(
    private itemOptionsRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private sharedFunctions: SharedFunctions,
    private snackbarService: SnackbarService,
    private fileService: FileService
  ) {
    if (window.innerWidth >= 500) {
      this.config.width = '60%';
    }
    if (this.config && this.config.data && this.config.data.type) {
      this.type = this.config.data.type;
      console.log("this.type", this.type)
    }
    if (this.config && this.config.data && this.config.data.itemDetails) {
      this.itemDetails = this.config.data.itemDetails;
      if (this.itemDetails && this.itemDetails.item && this.itemDetails.item.price) {
        this.itemPrice = this.itemDetails.item.price;
        console.log("this.itemPrice", this.itemPrice)
      }
    }
    if (this.type == 'add') {
      if (this.config && this.config.data && this.config.data.data) {
        this.itemData = this.config.data.data;
      }
    }
    if (this.type == 'edit') {
      if (this.config && this.config.data && this.config.data.data && this.config.data.data) {
        this.itemData = this.config.data.data.questionnaireData;
        this.answers = this.config.data.data.answersData;
      }
    }

    if (this.type == 'repeat') {
      this.config.width = '50%';
      this.config.header = "Repeat Last Customization";
      if (this.config && this.config.data && this.config.data.data && this.config.data.lastCustomization) {
        this.lastCustomization = this.config.data.lastCustomization;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth >= 500) {
      this.config.width = '60%';
    }
  }

  ngOnInit(): void {



    if (this.type == 'edit') {
      this.totalPrice = this.config.data.data.postData.totalPrice
      console.log("this.totalPrice", this.totalPrice)
    }

    if (this.itemData && this.itemData.labels) {
      this.qnrId = this.itemData.id;
      this.labels = this.itemData.labels;
      if (this.type == 'add') {
        if (this.labels[0]['question']['dataGridListProperties']['dataGridListColumns'][0]['listPropertie'] && this.labels[0]['question']['dataGridListProperties']['dataGridListColumns'][0]['listPropertie']['maxAnswerable'] == 1) {
          this.answers[0] = this.labels[0]['question']['dataGridListProperties']['dataGridListColumns'][0]['listPropertie']['values'][0];
        }
        else if (this.labels[0]['question']['dataGridListProperties']['dataGridListColumns'][0]['listPropertie'] && this.labels[0]['question']['dataGridListProperties']['dataGridListColumns'][0]['listPropertie']['maxAnswerable'] > 1) {
          this.answers[0] = [this.labels[0]['question']['dataGridListProperties']['dataGridListColumns'][0]['listPropertie']['values'][0]];
        }
        else {
          this.answers[0] = "";
        }
        this.labels.forEach(element => {
          let answerLine = {
            "labelName": element.question.labelName,
            "answer": {
              "dataGridList": [
                {
                  "dataGridListColumn": []
                }
              ]
            }
          }
          this.questionnaireAnswers.push(answerLine)
        });

        this.getPriceValue(this.labels[0].question.dataGridListProperties.dataGridListColumns[0].listPropertie, this.answers[0])
        this.saveAnswers(this.labels[0], this.labels[0].question.dataGridListProperties.dataGridListColumns[0], 0, this.answers[0])
        this.totalPrice = this.itemPrice
      }


    }

  }



  close() {
    this.itemOptionsRef.close()
  }

  ngOnDestroy() {
    this.itemOptionsRef.close()
  }

  getDataGridListColumns(data) {
    this.questionsLength = data.length
    return data;
  }

  convertDate(event, questions, question, i) {
    console.log(event)
    this.answers[i] = moment(event).format('DD-MM-YYYY')
    console.log(typeof (this.answers[i]))
    this.saveAnswers(questions, question, i)
  }

  convertToDate(date) {
    let dateToConvert = new Date(date);
    return moment(dateToConvert).format('DD-MM-YYYY');
  }

  getPriceValue(listPropertie, value) {
    let basePriceJson = this.sharedFunctions.convertToJsonFromString(listPropertie.basePrice);
    // console.log(basePriceJson)
    this.basePriceList = basePriceJson;
    return basePriceJson[value]
  }

  getPriceValueFromGridList(priceGridList, columnId, value) {
    let priceGridListJson = JSON.parse(priceGridList);
    this.priceGridList = priceGridListJson;
    // console.log(this.answers[0])
    return priceGridListJson[this.answers[0]][columnId][value];
  }

  // getTotalPrice(question) {
  //   this.totalPrice = this.itemPrice;
  //   for (let i = 0; i < Object.keys(this.answers).length; i++) {
  //     if (this.basePriceList && this.basePriceList[this.answers[i]]) {
  //       this.totalPrice = this.totalPrice + Number(this.basePriceList[this.answers[i]])
  //     }
  //     else if (this.priceGridList && this.priceGridList[this.answers[0]]) {
  //       if (this.priceGridList[this.answers[0]][question.columnId] && this.priceGridList[this.answers[0]][question.columnId][this.answers[i]]) {
  //         this.totalPrice = this.totalPrice + this.priceGridList[this.answers[0]][question.columnId][this.answers[i]]
  //       }
  //       else {

  //       }
  //     }
  // //   }
  //   console.log(this.totalPrice)
  // }


  saveAnswers(questionsObj, question, index, value?) {

    let column = {
      "columnId": question.columnId,
      "column": {},
      "quantity": 1
    }
    let maxAnswerable = question && question.listPropertie && question.listPropertie.maxAnswerable && question.listPropertie.maxAnswerable ? question.listPropertie.maxAnswerable : null;

    if (maxAnswerable && maxAnswerable > 1 && question.dataType == 'list') {
      column["column"][question.dataType] = this.answers[index];
    } else {
      if (question.dataType == 'list' || question.dataType == 'fileUpload') {
        column["column"][question.dataType] = [this.answers[index]];
      } else {
        column["column"][question.dataType] = this.answers[index];
      }
    }

    if (question && question.listPropertie && question.listPropertie.basePrice && question.listPropertie.maxAnswerable && question.listPropertie.maxAnswerable == 1) {
      column["price"] = Number(this.basePriceList[this.answers[index]]);
    }
    else if (question && question.listPropertie && !question.listPropertie.basePrice && question.listPropertie.maxAnswerable && question.listPropertie.maxAnswerable > 1) {
      let price = 0;
      for (let i = 0; i < this.answers[index].length; i++) {
        price = price + this.priceGridList[this.answers[0]][question.columnId][this.answers[index][i]];
      }
      column["price"] = price;
    }
    else {
      column["price"] = 0;
    }
    for (let i = 0; i < this.questionnaireAnswers.length; i++) {
      if (this.questionnaireAnswers[i].labelName == questionsObj.question.labelName) {
        let questionnaireAnswersIndex = this.questionnaireAnswers[i]["answer"]["dataGridList"][0]["dataGridListColumn"];
        questionnaireAnswersIndex.map((element) => {
          if (element.columnId == column.columnId) {
            questionnaireAnswersIndex.splice(questionnaireAnswersIndex.indexOf(element), 1);
          }
        })
        questionnaireAnswersIndex.push(column);
      }
    }

    console.log("questionnaireAnswers", this.questionnaireAnswers);
    this.getTotalPrice()

  }

  getTotalPrice() {
    this.totalPrice = this.itemPrice;
    for (let i = 0; i < this.questionnaireAnswers.length; i++) {
      let questionnaireAnswersIndex = this.questionnaireAnswers[i]["answer"]["dataGridList"][0]["dataGridListColumn"];
      questionnaireAnswersIndex.map((element) => {
        this.totalPrice = this.totalPrice + Number(element.price);
      })
    }
    console.log("this.totalPrice", this.totalPrice)
  }

  next(sequence) {
    if (this.timeType >= 1 && this.timeType < sequence) {
      this.timeType = this.timeType + 1;
    }
    else {
      let postData = {
        'questionnaireId': this.qnrId,
        'answerLine': this.questionnaireAnswers,
        'totalPrice': this.totalPrice
      }
      let fileData = {
        'selectedFiles': this.selectedFiles,
        'fileToUpload': this.filesToUpload
      }

      this.itemOptionsRef.close({ "postData": postData, "fileData": fileData, "answersData": this.answers });
    }
  }

  convertToJson(data) {
    return JSON.parse(data);
  }

  convertStringToJson(data) {
    let commaSeparatedArray = data.split(',');
    console.log(commaSeparatedArray);
  }

  getDate(date) {
    console.log(new Date(moment(new Date(date)).format('YYYY-MM-DD')));
    return new Date(moment(new Date(date)).format('YYYY-MM-DD'));
  }

  addNewItemOptions() {
    this.itemOptionsRef.close({ "lastCustomization": this.lastCustomization, "type": "addNew" });
  }

  repeatLastItemOptions() {
    this.itemOptionsRef.close({ "lastCustomization": this.lastCustomization, "type": "repeatLast" });
  }


  filesUpload(event, questionsObj, type, question, index) {
    const _this = this;
    this.selectedFiles[type] = { files: [], base64: [], caption: [] };
    console.log("Event ", event, type);
    const input = event.files;
    console.log("input ", input);
    _this.fileService.filesSelected(event, _this.selectedFiles[type]).then(
      () => {
        for (const pic of input) {
          let fileObj = {
            caption: type,
            mimeType: pic["type"],
            action: 'add'
          }
          fileObj['file'] = pic;
          fileObj['columnId'] = type;
          _this.filesToUpload.push(fileObj);
          _this.answers[index] = fileObj;
          console.log(_this.answers[index]);
        }
        console.log(JSON.stringify(this.answers))
        console.log("questionnaireAnswers", this.questionnaireAnswers);
        _this.saveAnswers(questionsObj, question, index);
      }).catch((error) => {
        _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
}
