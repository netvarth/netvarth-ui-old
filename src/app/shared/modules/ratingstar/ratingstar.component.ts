/* tslint:disable:forin */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

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
  constructor(

  ) { }
  curratval: any;
  showDecimalVals = false;
  ngOnInit() {
    this.curratval = this.ratingval || '';
    this.curratval = this.curratval.toString();
    if (this.includedFrom === 'refined' || this.includedFrom === 'moreoptions') {
      this.showDecimalVals = true;
    }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    /*const log: string[] = [];
    for (const propName in changes) {
      if (propName === 'ratingval') {
        const changedProp = changes[propName];
        const to = JSON.stringify(changedProp.currentValue) || '';
        this.curratval = to;
      }
    }*/
  }
  handle_ratingclick(val) {
    const retobj = { 'cloudindex': this.cloudindex, 'selectedrating': val };
    this.curratval = val;
    this.curratval = val.toString();
    this.ratingreturn.emit(retobj);
  }
  clearrating() {
    this.curratval = '';
  }
}
