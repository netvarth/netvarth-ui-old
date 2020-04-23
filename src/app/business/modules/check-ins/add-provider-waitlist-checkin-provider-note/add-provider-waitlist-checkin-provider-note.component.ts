import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-waitlist-checkin-provider-note',
  templateUrl: './add-provider-waitlist-checkin-provider-note.component.html'
})

export class AddProviderWaitlistCheckInProviderNoteComponent implements OnInit {

  add_provider_note_cap = Messages.ADD_PROVIDER_NOTE_CAP;
  provider_note_cap = Messages.PROVIDER_NOTE_CAP;
  note_placeholder = Messages.NOTE_PLACEHOLDER;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  checkin_id = null;
  message = '';
  source = 'add';
  provider_label = '';
  disableButton = false;

  constructor(
    public dialogRef: MatDialogRef<AddProviderWaitlistCheckInProviderNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

  ) {
    this.checkin_id = this.data.checkin_id || null;
    this.message = this.data.message;
    this.source = this.data.source;
    if (!this.checkin_id) {
      setTimeout(() => {
        this.dialogRef.close('error');
      }, projectConstants.TIMEOUT_DELAY);
    }
    this.provider_label = this.sharedfunctionObj.getTerminologyTerm('provider');
  }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
      message: ['', Validators.compose([Validators.required])]
    });
  }
  onSubmit(form_data) {
    this.disableButton = true;
    const post_data = form_data.message.trim() || '';
    if (post_data === '') {
      this.api_error = 'Please enter your note';
      setTimeout(() => {
        this.api_error = null;
      }, projectConstants.TIMEOUT_DELAY);
      this.disableButton = false;
      return;
    }
    if (this.source === 'appt') {
      this.provider_services.addProviderAppointmentNotes(this.checkin_id,
        post_data)
        .subscribe(
          () => {
            this.api_success = this.sharedfunctionObj.getProjectMesssages('PROVIDER_NOTE_ADD');
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.sharedfunctionObj.apiErrorAutoHide(this, error);
            this.disableButton = false;
          }
        );
    } else {
      this.provider_services.addProviderWaitlistNote(this.checkin_id,
        post_data)
        .subscribe(
          () => {
            this.api_success = this.sharedfunctionObj.getProjectMesssages('PROVIDER_NOTE_ADD');
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.sharedfunctionObj.apiErrorAutoHide(this, error);
            this.disableButton = false;
          }
        );
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
