import { Component, OnInit, Inject } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';
import { MAT_DIALOG_DATA } from '@angular/material';
@Component({
    selector: 'app-jdn-detail',
    templateUrl: './jdn-detail-component.html'
  })
  export class JdnComponent implements OnInit {
    jdnDetailList;

    constructor(private shared_functions: SharedFunctions,
        @Inject(MAT_DIALOG_DATA) public data: any) {
      }
    
    ngOnInit() {
        this.jdnDetailList = this.data.jdnList;

    }
  }