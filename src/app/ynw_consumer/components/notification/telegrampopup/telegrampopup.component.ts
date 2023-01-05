import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-telegrampopup',
  templateUrl: './telegrampopup.component.html'
})

export class TelegramPopupComponent implements OnInit {
  note_placeholder = 'Instructions';
  amForm: UntypedFormGroup;
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
  url: any;
  constructor(
    public dialogRef: MatDialogRef<TelegramPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private wordProcessor: WordProcessor
  ) {
    if (this.data) {
      this.url = this.data;
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

    this.dialogRef.close(form_data);
  }
  close() {
    this.dialogRef.close();
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
