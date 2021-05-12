import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { S3UrlProcessor } from '../../../shared/services/s3-url-processor.service';
import { Messages } from '../../../shared/constants/project-messages';
import { WordProcessor } from '../../../shared/services/word-processor.service';


@Component({
  selector: 'app-consumer-virtual-serviceinfo',
  templateUrl: './consumer-virtual-serviceinfo.component.html',
  styleUrls: ['./consumer-virtual-serviceinfo.component.css']
})

export class ConsumerVirtualServiceinfoComponent implements OnInit {
  lngknown = 'yes';
  virtualForm: FormGroup;
  details: any;
  gender_cap = Messages.GENDER_CAP;
  consumer_label: any;
  disableButton;
  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConsumerVirtualServiceinfoComponent>,
    private wordProcessor: WordProcessor,
    public fed_service: FormMessageDisplayService, private s3Processor: S3UrlProcessor) {
    this.data = this.s3Processor.getJson(data);
  }

  ngOnInit(): void {
    this.createForm();
    this.consumer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
  createForm() {
    this.virtualForm = this.fb.group({
      dob: ['', Validators.compose([Validators.required])],
      pincode: ['', Validators.compose([Validators.required])],
      preferredLanguage: ['', Validators.compose([Validators.required])],
      islanguage: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])]

    });
    // console.log(this.data);
    if (this.data !== null || this.data !== undefined || this.data !== '') {
      this.updateForm();
    }
  }
  closeDialog(){
    this.dialogRef.close();
  }
  updateForm() {
    this.details = this.data;
    let language = [];
    let usr_pincode = '';
    if (this.details.userProfile.preferredLanguages) {
      language = JSON.parse(this.details.userProfile.preferredLanguages);
    }
    if (language === null) {
      language = [];
    }
    if (this.details.userProfile.pinCode) {
      usr_pincode = this.details.userProfile.pinCode;
    }
    if (this.details.bookingLocation && this.details.bookingLocation.pincode) {
      usr_pincode = this.details.bookingLocation.pincode;
    }



    this.virtualForm.patchValue({
      dob: this.details.userProfile.dob,
      pincode: usr_pincode,
      preferredLanguage: (this.details.userProfile.preferredLanguages && this.details.userProfile.preferredLanguages) ? language[0] : '',
      islanguage: (this.details.userProfile.preferredLanguages && language[0] === 'English') ? 'yes' : 'no',
      gender: this.details.userProfile.gender
    });
    if (language[0] === 'English') {
      this.lngknown = 'yes';
    } else {
      this.lngknown = 'no';
    }
  }
  validateFields(){
    if(this.virtualForm.get('pincode').value === '') {
      return true;
    }
    if(this.lngknown==='no'){
      if (this.virtualForm.get('preferredLanguage').value === ''){
        return true;
      }
    }
  }
  onSubmit(formdata) {

    this.dialogRef.close(formdata)

  }
  onChange(event) {

    console.log(event.value);
    this.lngknown = event.value

  }
}
