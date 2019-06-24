import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-waitlist-checkin-consumer-note',
  templateUrl: './provider-waitlist-checkin-consumer-note.component.html'
})

export class ProviderWaitlistCheckInConsumerNoteComponent implements OnInit {

  note_cap = Messages.CONS_NOTE_NOTE_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  checkin;
  consumer_label = '';

  constructor(
    public dialogRef: MatDialogRef<ProviderWaitlistCheckInConsumerNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedfunctionObj: SharedFunctions

  ) {
    this.checkin = data.checkin;
    this.consumer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
  }

  ngOnInit() {
    if (!this.checkin.consumerNote) {
      this.dialogRef.close();
    }
  }
}
