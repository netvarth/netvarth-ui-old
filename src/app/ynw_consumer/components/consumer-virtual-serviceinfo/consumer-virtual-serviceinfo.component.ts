import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-consumer-virtual-serviceinfo',
  templateUrl: './consumer-virtual-serviceinfo.component.html',
  styleUrls: ['./consumer-virtual-serviceinfo.component.css']
})

export class ConsumerVirtualServiceinfoComponent implements OnInit {
  lngknown='yes';
virtualForm:FormGroup;
  constructor( private fb: FormBuilder,
    public dialogRef: MatDialogRef<ConsumerVirtualServiceinfoComponent>,
    public fed_service: FormMessageDisplayService,) { }

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
  }
  onSubmit(formdata){

console.log(formdata);
 this.dialogRef.close(formdata)

  }
  onChange(event) {
  console.log(event.value);
 this.lngknown=event.value
  }
}
