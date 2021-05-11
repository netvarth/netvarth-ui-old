import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { S3UrlProcessor } from '../../../shared/services/s3-url-processor.service';

@Component({
  selector: 'app-consumer-virtual-serviceinfo',
  templateUrl: './consumer-virtual-serviceinfo.component.html',
  styleUrls: ['./consumer-virtual-serviceinfo.component.css']
})

export class ConsumerVirtualServiceinfoComponent implements OnInit {
  lngknown='yes';
virtualForm:FormGroup;
  details: any;
  constructor( private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConsumerVirtualServiceinfoComponent>,
    public fed_service: FormMessageDisplayService, private s3Processor: S3UrlProcessor) { 
      this.data=this.s3Processor.getJson(data);
    }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.virtualForm = this.fb.group({
      dob: ['', Validators.compose([Validators.required])],
      pincode: ['', Validators.compose([Validators.required])],
      preferredLanguage: ['', Validators.compose([Validators.required])],
      islanguage: ['', Validators.compose([Validators.required])],
     
    });
    // console.log(this.data);
    if(this.data!==null|| this.data!==undefined ||this.data!==''){
      this.updateForm();
    }
  }
  updateForm(){
    this.details=this.data;
    this.virtualForm.patchValue({
      dob: this.details.userProfile.dob,
      pincode: (this.details.bookingLocation &&this.details.bookingLocation.pincode)?this.details.bookingLocation.pincode:'' || this.details.userProfile.pinCode,
      preferredLanguage: (this.details.preferredLanguage&&this.details.preferredLanguage[0])?this.details.preferredLanguage[0]:'',
      isLanguage:(this.details.preferredLanguage&& this.details.preferredLanguage[0]==='English')?'yes':'no'
    });
  }
  onSubmit(formdata){

 this.dialogRef.close(formdata)

  }
  onChange(event) {
  console.log(event.value);
 this.lngknown=event.value
  }
}
