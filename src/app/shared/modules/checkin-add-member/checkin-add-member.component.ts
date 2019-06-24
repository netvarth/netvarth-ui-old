import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
// import { ConsumerServices } from '../../services/consumer-services.service';
import { SharedServices } from '../../services/shared-services';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-checkin-consumer-add-member',
  templateUrl: './checkin-add-member.component.html',
  // styleUrls: ['./home.component.scss']
})
export class CheckinAddMemberComponent implements OnInit {
  fill_fol_det_cap = Messages.FILL_FOLL_DETAILS_CAP;
  first_name_cap = Messages.F_NAME_CAP;
  last_name_cap = Messages.L_NAME_CAP;
  firstname = '';
  lastname = '';
  mobile = '';
  gender = '';
  dob = '';
  dobholder = '';
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id;
  tday = new Date();

  @Input() calledFrom: any;
  @Output() returnDetails = new EventEmitter<any>();

  constructor(
    public fed_service: FormMessageDisplayService,
    public sharedservice: SharedServices
  ) {
  }

  ngOnInit() {
  }

  /*createForm() {
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
  }*/

  /*onSubmit (form_data) {

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
  }*/

  /* editMember(post_data) {
 
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
   }*/
  valuechange() {
    const retobj = {
      'fname': this.firstname || '',
      'lname': this.lastname || '',
      'mobile': this.mobile || '',
      'gender': this.gender || '',
      'dob': this.dobholder || ''
    };
    this.returnDetails.emit(retobj);
  }
  dateChanged(e) {
    if (e) {
      if (e._i) {
        let cday = e._i.date;
        let cmon = (e._i.month + 1);
        const cyear = e._i.year;
        if (cday < 10) {
          cday = '0' + cday;
        }
        if (cmon < 10) {
          cmon = '0' + cmon;
        }
        this.dobholder = cyear + '-' + cmon + '-' + cday;
      }
    } else {
      this.dobholder = '';
    }
    this.valuechange();
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
