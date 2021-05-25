import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
// import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
// import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
// import { Messages } from '../../../../../shared/constants/project-messages';
 import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-telegrampopup',
  templateUrl: './telegrampopup.component.html'
})

export class telegramPopupComponent implements OnInit {

  
  
  note_placeholder = 'Instructions';
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
    public dialogRef: MatDialogRef<telegramPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    // public fed_service: FormMessageDisplayService,
    // public provider_services: ProviderServices,
    // public sharedfunctionObj: SharedFunctions,
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
    
    this.dialogRef.close(form_data);


    
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  
 
}
