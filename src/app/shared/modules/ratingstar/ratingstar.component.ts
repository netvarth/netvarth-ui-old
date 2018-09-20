/* tslint:disable:forin */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { base_url } from '../../constants/urls';

import { projectConstants } from '../../constants/project-constants';


@Component({
  selector: 'app-rating-star',
  templateUrl: './ratingstar.component.html',
  styleUrls: ['./ratingstar.component.css']
})
export class RatingStarComponent implements OnInit, OnChanges {

  @Input() cloudindex: string;
  @Input() ratingval: string;
  @Input() includedFrom: string;
  @Output() ratingreturn = new EventEmitter<any>();
  constructor (
    private shared_service: SharedServices,
    private shared_functions: SharedFunctions,
    ) {}
  curratval: any;
  showDecimalVals = false;
  ngOnInit() {
    // console.log('includeded from', this.includedFrom, 'passed', this.ratingval);
    this.curratval = this.ratingval || '';
    this.curratval = this.curratval.toString();
    if (this.includedFrom === 'refined' || this.includedFrom === 'moreoptions') {
      this.showDecimalVals = true;
    }
  }
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    /*const log: string[] = [];
    for (const propName in changes) {
      if (propName === 'ratingval') {
        const changedProp = changes[propName];
        const to = JSON.stringify(changedProp.currentValue) || '';
        this.curratval = to;
        console.log('currentval', this.curratval);
      }
    }*/
  }
  handle_ratingclick(val) {
    const retobj = {'cloudindex': this.cloudindex, 'selectedrating': val};
    this.curratval = val;
    this.curratval = val.toString();
    this.ratingreturn.emit(retobj);
  }
  clearrating() {
    this.curratval = '';
  }
}
