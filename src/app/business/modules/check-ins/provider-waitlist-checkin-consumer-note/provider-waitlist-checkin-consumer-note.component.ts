import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-waitlist-checkin-consumer-note',
  templateUrl: './provider-waitlist-checkin-consumer-note.component.html'
})

export class ProviderWaitlistCheckInConsumerNoteComponent implements OnInit {

  note_cap = Messages.CONS_NOTE_NOTE_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  checkin;
  consumer_label = '';
  type;
  noteTitle;
  constructor(
    public dialogRef: MatDialogRef<ProviderWaitlistCheckInConsumerNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedfunctionObj: SharedFunctions

  ) {
    console.log(data);
    this.checkin = data.checkin;
    this.type = data.type;
    if (this.checkin.service && this.checkin.service.consumerNoteTitle) {
      this.noteTitle = this.checkin.service.consumerNoteTitle;
    } else {
      if (this.type === 'order-details') {
        this.noteTitle = 'Item Notes';
      } else {
        this.noteTitle = 'Notes';
      }
    }
    this.consumer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
  }

  ngOnInit() {
    // if (!this.checkin.consumerNote) {
    //   this.dialogRef.close();
    // }
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.sharedfunctionObj.convert24HourtoAmPm(slots[0]);
  }
}
