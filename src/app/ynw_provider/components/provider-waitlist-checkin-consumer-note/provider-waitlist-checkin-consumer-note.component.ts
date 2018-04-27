import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-waitlist-checkin-consumer-note',
  templateUrl: './provider-waitlist-checkin-consumer-note.component.html'
})

export class ProviderWaitlistCheckInConsumerNoteComponent implements OnInit {

  checkin ;
  constructor(
    public dialogRef: MatDialogRef<ProviderWaitlistCheckInConsumerNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedfunctionObj: SharedFunctions

    ) {
      this.checkin = data.checkin;
     }

  ngOnInit() {
    if (!this.checkin.consumerNote) {
      this.dialogRef.close();
    }
  }



}
