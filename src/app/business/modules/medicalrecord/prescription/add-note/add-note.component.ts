import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstants } from '../../../../../app.component';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-note',
  templateUrl: './add-note.component.html'
})

export class AddNoteComponent implements OnInit {

  
  provider_note_cap = Messages.PROVIDER_NOTE_CAP;
  note_placeholder = 'Instructions';
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
    public dialogRef: MatDialogRef<AddNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private wordProcessor: WordProcessor
    
  ) {
      if(this.data.message){
        this.message = this.data.message;
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
    this.dialogRef.close(form_data);


    
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  
 
}
