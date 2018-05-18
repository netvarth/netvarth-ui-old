import { Component, Inject, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

// import { ConsumerServices } from '../../services/consumer-services.service';
import { SharedServices } from '../../services/shared-services';
import {Messages} from '../../../shared/constants/project-messages';
import {projectConstants} from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-consumer-add-member',
  templateUrl: './add-member.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddMemberComponent implements OnInit {

  firstname = '';
  lastname = '';
  mobile = '';
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id ;
  @Input() calledFrom: any;
  @Output() returnDetails = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<AddMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public sharedservice: SharedServices
    ) {
        console.log(data);
     }

  ngOnInit() {
    console.log('called from', this.calledFrom);
    // this.createForm();
  }

  createForm() {
    this.amForm = this.fb.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required])]
    });

    if (this.data.type === 'edit') {
      this.updateForm();
    }
  }

  updateForm() {
    this.amForm.setValue({
      'first_name': this.data.member.userProfile.firstName || null,
      'last_name': this.data.member.userProfile.lastName || null,
      'mobile':  this.data.member.userProfile.primaryMobileNo || null
    });
  }

  onSubmit (form_data) {

    const post_data = {
    'userProfile': {
                      'firstName': form_data.first_name,
                      'lastName':  form_data.last_name,
                      'primaryMobileNo': form_data.mobile,
                      'countryCode': '+91',
                    }
    };

    if (this.data.type === 'edit') {
      this.editMember(post_data);
    } else if (this.data.type === 'add') {
      this.addMember(post_data);
    }
  }

  editMember(post_data) {

    post_data.user =  this.data.member.user;
    this.sharedservice.editMember(post_data)
    .subscribe(
      data => {
        this.api_success = Messages.MEMBER_UPDATED;
        setTimeout(() => {
         this.dialogRef.close();
        }, projectConstants.TIMEOUT_DELAY);
      },
      error => {
        this.api_error = error.error;
      }
    );
  }

  addMember(post_data) {

    this.sharedservice.addMembers(post_data)
    .subscribe(
      data => {
       this.api_success = Messages.MEMBER_CREATED;
       setTimeout(() => {
        this.dialogRef.close();
       }, projectConstants.TIMEOUT_DELAY);
      },
      error => {
        this.api_error = error.error;
      }
    );
  }
  valuechange() {
    // console.log('value change', this.firstname, this.lastname, this.mobile);
    const retobj = {
      'fname': this.firstname,
      'lname': this.lastname,
      'mobile': this.mobile
    };
    this.returnDetails.emit(retobj);
  }
  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }
}
