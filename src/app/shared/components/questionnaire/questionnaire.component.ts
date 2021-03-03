import { Component, Input, OnInit } from '@angular/core';
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
  answers = {};
  constructor(private sharedService: SharedServices,
    private datepipe: DateFormatPipe) { }

  ngOnInit(): void {
    this.questionnaireList = [{
      "id": 2,
      "labels": [{
        "question": {
          "id": 5,
          "labelName": "records",
          "fieldDataType": "FileUpload",
          "fieldScope": "consumer",
          "label": "former medical records, if any ",
          "labelValues": null,
          "filePropertie": {
            "minSize": 10,
            "maxSize": 10,
            "fileTypes": ["jpg", "doc", "png", "pdf"],
            "minNoOfFile": 1,
            "allowedDocuments": ["recodes"]
          },
          "billable": false
        }
      }, {
        "question": {
          "id": 6,
          "labelName": "medical conditions",
          "fieldDataType": "List",
          "fieldScope": "service",
          "label": "known medical conditions including allergies",
          "labelValues": ["diabetes", "pressure "],
          "listPropertie": {},
          "billable": false
        }
      }, {
        "question": {
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
        }
      }]
    }];
    console.log(this.questionnaireList);
    console.log(this.source);
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
  getDate(date) {
    return new Date(this.datepipe.transformTofilterDate(date));
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
