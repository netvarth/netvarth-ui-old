import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstants } from '../../../../app.component';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

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
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  showCaptionBox: any = {};
  activeImageCaption: any = [];
  constructor(
    public dialogRef: MatDialogRef<AddProviderWaitlistCheckInProviderNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private wordProcessor: WordProcessor
    
  ) {
    this.checkin_id = this.data.checkin_id || null;
    this.message = this.data.message;
    this.source = this.data.source;
    if (!this.checkin_id) {
      setTimeout(() => {
        this.dialogRef.close('error');
      }, projectConstants.TIMEOUT_DELAY);
    }
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
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
    console.log(form_data);
    // const post_data = form_data.message.trim() || '';
    if (form_data.message === '') {
      this.api_error = 'Please enter your note';
      setTimeout(() => {
        this.api_error = null;
      }, projectConstants.TIMEOUT_DELAY);
      this.disableButton = false;
      return;
    }

    const dataToSend: FormData = new FormData();
    dataToSend.append('message',form_data.message.trim() || '');
    const captions = {};
    let i = 0;
    if (this.selectedMessage) {
      for (const pic of this.selectedMessage.files) {
        dataToSend.append('attachments', pic, pic['name']);
        captions[i] = 'caption';
        i++;
      }
    }
    const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
    dataToSend.append('captions', blobPropdata);
    if (this.source === 'appt') {
      this.provider_services.addProviderAppointmentNotes(this.checkin_id,
        dataToSend)
        .subscribe(
          () => {
            this.api_success = this.wordProcessor.getProjectMesssages('PROVIDER_NOTE_ADD');
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.wordProcessor.apiErrorAutoHide(this, error);
            this.disableButton = false;
          }
        );
    } else {
      this.provider_services.addProviderWaitlistNote(this.checkin_id,
        dataToSend)
        .subscribe(
          () => {
            this.api_success = this.wordProcessor.getProjectMesssages('PROVIDER_NOTE_ADD');
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.wordProcessor.apiErrorAutoHide(this, error);
            this.disableButton = false;
          }
        );
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.wordProcessor.apiErrorAutoHide(this, 'Selected image type not supported');
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.wordProcessor.apiErrorAutoHide(this, 'Please upload images with size < 10mb');
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
    if (this.showCaptionBox && this.showCaptionBox[index]) {
      delete this.showCaptionBox[index];
      delete this.activeImageCaption[index];
    }
  }
  closeCaptionMenu(index) {
    if (this.showCaptionBox && this.showCaptionBox[index]) {
      delete this.activeImageCaption[index];
      this.showCaptionBox[index] = false;
    }
  }
}
