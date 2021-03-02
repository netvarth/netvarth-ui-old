import { Component, Input, OnInit } from '@angular/core';
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
  answers = {};
  constructor(private sharedService: SharedServices) { }

  ngOnInit(): void {
    console.log(this.questionnaireList);
    console.log(this.source);
    this.questionnaireList = [{
      "id": 2,
      "account": 2,
      "transactionType": "SERVICE",
      "transactionId": 1,
      "channel": "ONLINE",
      "questions": [{
        "id": 1,
        "labelName": "blood",
        "fieldDataType": "List",
        "fieldScope": "consumer",
        "label": "Enter  your blood group",
        "labelValues": ["A+", "B+", "O+"],
        "listPropertie": {},
        "billable": false
      }, {
        "id": 2,
        "labelName": "Place Name",
        "fieldDataType": "PlainText",
        "fieldScope": "consumer",
        "label": "Enter your address",
        "labelValues": "kochi",
        "plainTextPropertie": {
          "minNoOfLetter": 5,
          "maxNoOfLetter": 100
        },
        "billable": false
      }, {
        "id": 3,
        "labelName": "weight",
        "fieldDataType": "Number",
        "fieldScope": "consumer",
        "label": "Enter your weight",
        "labelValues": "50.0",
        "numberPropertie": {
          "start": 10,
          "end": 10
        },
        "billable": false
      }, {
        "id": 4,
        "labelName": "aadhaar card",
        "fieldDataType": "FileUpload",
        "fieldScope": "consumer",
        "label": "upload your aadhaar card",
        "labelValues": null,
        "filePropertie": {
          "minSize": 100,
          "maxSize": 100,
          "fileTypes": ["jpg", "png", "doc", "pdf"],
          "minNoOfFile": 1,
          "maxNoOfFile": 2,
          "allowedDocuments": ["Adhar Card", " Ration Card"]
        },
        "billable": false
      }, {
        "id": 5,
        "labelName": "records",
        "fieldDataType": "FileUpload",
        "fieldScope": "consumer",
        "label": "former medical records, if any ",
        "labelValues": null,
        "filePropertie": {
          "minSize": 10,
          "maxSize": 10,
          "fileTypes": ["jpg", "png", "doc", "pdf"],
          "minNoOfFile": 1,
          "allowedDocuments": ["recodes"]
        },
        "billable": false
      }, {
        "id": 6,
        "labelName": "medical conditions",
        "fieldDataType": "List",
        "fieldScope": "service",
        "label": "known medical conditions including allergies",
        "labelValues": ["diabetes", "pressure "],
        "listPropertie": {},
        "billable": false
      }, {
        "id": 7,
        "labelName": "birthdate",
        "fieldDataType": "Date",
        "fieldScope": "consumer",
        "label": "enter your birth date",
        "labelValues": null,
        "dateProperties": {
          "startDate": "01-01-1980",
          "endDate": "01-01-2021"
        },
        "billable": false
      }]
    }];
    if (this.source === 'consCheckin' || this.source === 'consAppt') {
      // this.getConsumerQuestionnaire();
    } else {
      // this.getProviderQuestionnaire();
    }
  }
  filesSelected(ev) {

  }
  getConsumerQuestionnaire() {
    this.sharedService.getConsumerQuestionnaire(this.serviceId, this.consumerId, this.accountId).subscribe(data => {
      console.log(data);
    });
  }
  getProviderQuestionnaire() {
    this.sharedService.getProviderQuestionnaire(this.serviceId, this.consumerId, this.channel).subscribe(data => {
      console.log(data);
    });
  }
  onSubmit() {
    console.log(this.answers);
  }
  listChange(ev, value, question) {
    if (this.answers[question.labelName]) {

    } else {

    }
    if (ev.checked) {
      this.answers[question.labelName] = value;
    } else {

    }
    console.log(this.answers);
  }
  isChecked(value, question) {
    if (this.answers[question.labelName] === value) {
      return true;
    } else {
      return false;
    }
  }
  dateChange(ev) {
    console.log(ev);
  }
}
