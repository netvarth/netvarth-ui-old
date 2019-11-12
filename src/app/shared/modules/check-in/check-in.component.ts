import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
})
export class CheckInComponent implements OnInit {

    customer_data: any = [];
    page_source = null;
    showinner = false;

    constructor(
    public dialogRef: MatDialogRef<CheckInComponent>,
    public _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
      this.customer_data = this.data || [];
      this.page_source = this.data.moreparams.source;
      this.showinner = true;
    }

    ngOnInit() {

    }
    handleCheckinReturn(retVal) {
      if(retVal.mode === 'provider_checkin'){
      if (retVal.list === 'reloadlist') {
        this.dialogRef.close('reloadlist');
      }
    }
    }
}
