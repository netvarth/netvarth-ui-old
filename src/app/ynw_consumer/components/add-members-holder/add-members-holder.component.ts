import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-add-members-holder',
  templateUrl: './add-members-holder.component.html'
})

export class AddMembersHolderComponent implements OnInit {
  family_member_cap = Messages.FAMILY_MEMBERS;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  update_btn_cap = Messages.UPDATE_BTN;
  member_cap = Messages.MEMBER_CAPTION;
  api_error = null;
  api_success = null;
  member_list: any = [];
  disableButton = false;
  addmemberobj = { 'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': '' };
  breadcrumbs_init = [
    {
      // title: Messages.DASHBOARD_TITLE,
      url: '/consumer'
    },
    {
      title: Messages.FAMILY_MEMBERS,
      // url: '/' + this.shared_functions.isBusinessOwner('returntyp') + '/members'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;

  constructor(
    public dialogRef: MatDialogRef<AddMembersHolderComponent>,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.type === 'edit') {
      this.addmemberobj.fname = data.member.userProfile.firstName || '';
      this.addmemberobj.lname = data.member.userProfile.lastName || '';
      this.addmemberobj.mobile = data.member.userProfile.primaryMobileNo || '';
      this.addmemberobj.gender = data.member.userProfile.gender || '';
      this.addmemberobj.dob = data.member.userProfile.dob || '';
    }
  }

  ngOnInit() {
  }

  handleReturnDetails(obj) {
    this.resetApi();
    this.addmemberobj.fname = obj.fname || '';
    this.addmemberobj.lname = obj.lname || '';
    this.addmemberobj.mobile = obj.mobile || '';
    this.addmemberobj.gender = obj.gender || '';
    this.addmemberobj.dob = obj.dob || '';
  }
  handleSaveMember() {
    this.disableButton = true;
    this.resetApi();
    let derror = '';
    const namepattern = new RegExp(projectConstants.VALIDATOR_CHARONLY);
    const phonepattern = new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
    const phonecntpattern = new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);

    if (!namepattern.test(this.addmemberobj.lname) || this.addmemberobj.lname.trim() === '') {
      derror = Messages.LASTNAME_INVAL_MSG;
    }
    if (this.addmemberobj.lname.trim() === '') {
      derror = 'Please enter the last name';
    }
    if (!namepattern.test(this.addmemberobj.fname)) {
      derror = Messages.FIRSTNAME_INVAL_MSG;
    }
    if (this.addmemberobj.fname.trim() === '') {
      derror = 'Please enter the first name';
    }

    if (derror === '') {
      if (this.addmemberobj.mobile !== '') {
        if (!phonepattern.test(this.addmemberobj.mobile)) {
          derror = Messages.PHONE_NUM_VAL_MSG;
        } else if (!phonecntpattern.test(this.addmemberobj.mobile)) {
          derror = Messages.PHONE_DIGIT_VAL_MSG;
        }
      }
    }

    /*if (derror === '' && this.addmemberobj.gender === '') {
      derror = 'Please select the gender';
    }
    if (derror === '' && this.addmemberobj.dob === '') {
      derror = 'Please select the date of birth';
    }*/

    if (derror === '') {
      const post_data = {
        'userProfile': {
          'firstName': this.addmemberobj.fname,
          'lastName': this.addmemberobj.lname
        }
      };
      if (this.addmemberobj.mobile !== '') {
        post_data.userProfile['primaryMobileNo'] = this.addmemberobj.mobile;
        post_data.userProfile['countryCode'] = '+91';
      }
      if (this.addmemberobj.gender !== '') {
        post_data.userProfile['gender'] = this.addmemberobj.gender;
      }
      if (this.addmemberobj.dob !== '') {
        post_data.userProfile['dob'] = this.addmemberobj.dob;
      }
      if (this.data.type === 'add') {
        this.shared_services.addMembers(post_data)
          .subscribe(() => {
            this.api_success = Messages.MEMBER_CREATED;
            // this.getFamilyMembers();
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
            error => {
              this.api_error = this.shared_functions.getProjectErrorMesssages(error);
              this.disableButton = false;
            });
      } else if (this.data.type === 'edit') {
        post_data['user'] = this.data.member.user;
        this.shared_services.editMember(post_data)
          .subscribe(
            () => {
              this.api_success = Messages.MEMBER_UPDATED;
              setTimeout(() => {
                this.dialogRef.close('reloadlist');
              }, projectConstants.TIMEOUT_DELAY);
            },
            error => {
              this.api_error = this.shared_functions.getProjectErrorMesssages(error);
              this.disableButton = false;
            }
          );
      }

    } else {
      this.api_error = derror;
      this.disableButton = false;
    }
  }
  resetApi() {
    this.api_error = null;
    this.api_success = null;
  }
}
