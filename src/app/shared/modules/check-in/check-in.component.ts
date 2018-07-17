import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';

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
      // console.log('check-inpassed outer', data);
      this.customer_data = this.data || [];
      this.page_source = this.data.moreparams.source;
      this.showinner = true;
    }

    ngOnInit() {

    }
    handleCheckinReturn(retVal) {
      if (retVal === 'reloadlist') {
        // console.log('returned from inner ', retVal);
        this.dialogRef.close('reloadlist');
      }
    }
}
