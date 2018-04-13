/* tslint:disable:forin */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
export class RatingStarComponent implements OnInit {

  @Input() cloudindex: string;
  @Input() ratingval: string;
  @Output() ratingreturn = new EventEmitter<any>();
  constructor (
    private shared_service: SharedServices,
    private shared_functions: SharedFunctions,
    ) {}
  curratval: any;
  ngOnInit() {
    // console.log('passedin', this.cloudindex);
    this.curratval = this.ratingval || '';
  }
  handle_ratingclick(val) {
    const retobj = {'cloudindex': this.cloudindex, 'selectedrating': val};
    this.ratingreturn.emit(retobj);
  }
}
