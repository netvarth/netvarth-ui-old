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
        this.filter[element.field + '-' + element.filterType] = '';
      });
    }
  }

  resetFilters() {
    if (this.filterConfig && this.filterConfig.length > 0) {
      this.filterConfig.forEach(element => {
        this.filter[element.field + '-' + element.filterType] = '';
      });
    }
    this.filter['branch-eq'] = 0;
    let api_filter = {};
    api_filter['from'] = 0;
    api_filter['count'] = 10;
    this.filterEvent.emit(api_filter);
  }

  applyFilters() {

    let api_filter = {};
    console.log("filter", this.filter)

    this.filterConfig.forEach(element => {
      if (this.filter[element.field + '-' + element.filterType] && this.filter[element.field + '-' + element.filterType] != "") {
        if (element.type == 'date') {
          api_filter[element.field + '-' + element.filterType] = moment(this.filter[element.field + '-' + element.filterType]).format("YYYY-MM-DD");
        }
        else {
          api_filter[element.field + '-' + element.filterType] = this.filter[element.field + '-' + element.filterType];
        }
      }

    });
    if (Object.keys(api_filter).length == 0) {
      api_filter['from'] = 0;
      api_filter['count'] = 10;
    }
    this.filterEvent.emit(api_filter);
    this.sidebarVisible = false;
  }

}
