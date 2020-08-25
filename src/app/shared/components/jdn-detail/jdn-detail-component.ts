import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
@Component({
    selector: 'app-jdn-detail',
    templateUrl: './jdn-detail-component.html'
  })
  export class JdnComponent implements OnInit {
    jdnDetailList;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
      }
    ngOnInit() {
        this.jdnDetailList = this.data.jdnList;
    }
  }
