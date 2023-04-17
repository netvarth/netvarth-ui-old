import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() position;
  @Input() filterConfig;
  sidebarVisible: any;
  filter: any = {}
  @Output() filterEvent = new EventEmitter<any>();
  constructor() {

  }

  ngOnInit(): void {
    console.log("filterConfig", this.filterConfig)
    if (this.filterConfig && this.filterConfig.length > 0) {
      this.filterConfig.forEach(element => {
        this.filter[element.field] = '';
      });
    }
  }

  resetFilters() {
    if (this.filterConfig && this.filterConfig.length > 0) {
      this.filterConfig.forEach(element => {
        this.filter[element.field] = '';
      });
    }
    this.filterEvent.emit({})
  }

  applyFilters() {

    let api_filter = {};

    this.filterConfig.forEach(element => {
      if (this.filter[element.field] && this.filter[element.field] != "") {
        if (element.type == 'text') {
          api_filter[element.field + '-' + element.filterType] = this.filter[element.field];
        }
        else if (element.type == 'date') {
          api_filter[element.field + '-' + element.filterType] = moment(this.filter[element.field]).format("YYYY-MM-DD");
        }
      }
    });

    this.filterEvent.emit(api_filter)
    this.sidebarVisible = false;
  }

}
