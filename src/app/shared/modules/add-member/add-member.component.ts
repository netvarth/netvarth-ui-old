import { Component, Inject, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
// import { ConsumerServices } from '../../services/consumer-services.service';
import { SharedServices } from '../../services/shared-services';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../functions/shared-functions';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-consumer-add-member',
  templateUrl: './add-member.component.html',
   styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {


  fill_foll_details_cap = Messages.FILL_FOLL_DETAILS_CAP;
  first_name_cap = Messages.F_NAME_CAP;
  last_name_cap = Messages.L_NAME_CAP;
  mobile_no = Messages.MOBILE_NUMBER_CAP;
  gender_cap = Messages.GENDER_CAP;
  male_cap = Messages.MALE_CAP;
  female_cap = Messages.FEMALE_CAP;
  dob_cap = Messages.DOB_CAP;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;

  firstname = '';
  lastname = '';
  mobile = '';
  gender = '';
  dob = '';
  dobholder = '';
  amForm: UntypedFormGroup;
  api_error = null;
  api_success = null;
  parent_id;
  tday = new Date();
  minday = new Date(1900, 0, 1);

  @Input() calledFrom: any;
  @Output() returnDetails = new EventEmitter<any>();
  countryCode_whtsap: any;
  whatsappnumber: any;
  telegramnumber: any;
  countryCode_telegram: any;
  email: any;
  beforeDelete:boolean;
  isProviderAccount: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fed_service: FormMessageDisplayService,
    public sharedservice: SharedServices,
    private snackbarService: SnackbarService,
    public shared_functions: SharedFunctions,
    public translate: TranslateService,
  ) {
   
    if(data && data[0] && data[0].requestType && data[0].requestType==='deactiveAccount'){
      this.beforeDelete=true;
      // if(data && data[2] && data[2].requestFrom && data[2].requestFrom === 'provider'){
       
      //   this.isProviderAccount = true;
      // }
      // else{
      
      //   this.isProviderAccount = false;
      // }
      if(data && data[1] && data[1].data === 'provider'){
       
        this.isProviderAccount = true;
      }
      else{
      
        this.isProviderAccount = false;
      }
    }
    if (data.type === 'edit') {
      console.log("Member Data",data);
      this.firstname = data.member.userProfile.firstName || '';
      this.lastname = data.member.userProfile.lastName || '';
      this.mobile = data.member.userProfile.primaryMobileNo || '';
      this.gender = data.member.userProfile.gender || '';
      this.dob = data.member.userProfile.dob || '';
      this.dobholder = data.member.userProfile.dob || '';
     this.email=data.member.userProfile.email || '';
     console.log("Email Updated :",this.email);
      if(data.member.userProfile.whatsAppNum){
        this.countryCode_whtsap=data.member.userProfile.whatsAppNum.countryCode;
        this.whatsappnumber=data.member.userProfile.whatsAppNum.number;
      }
      console.log(data.member.userProfile.telegramNum);
      if(data.member.userProfile.telegramNum){
        this.countryCode_telegram=data.member.userProfile.telegramNum.countryCode;
        this.telegramnumber=data.member.userProfile.telegramNum.number;
      }
      // if(data.member.userProfile.email){
      //   this.email=data.member.userProfile.email;
        
      // }
    }
  }

  ngOnInit() {
    this.translate.use(JSON.parse(localStorage.getItem('translatevariable'))) 
  }
  isNumericSign(evt) {
    return this.shared_functions.isNumericSign(evt);
  }
  valuechange() {
    const retobj = {
      'fname': this.firstname || '',
      'lname': this.lastname || '',
      'mobile': this.mobile || '',
      'gender': this.gender || '',
      'dob': this.dobholder || '',
      'countryCode_whtsap':this.countryCode_whtsap,
      'whatsappnumber':this.whatsappnumber,
      'countryCode_telegram':this.countryCode_telegram,
      'telegramnumber':this.telegramnumber,
      'email':this.email
    };
    console.log(retobj);
    this.returnDetails.emit(retobj);
  }
  dateChanged(e) {
    if (e) {
      if (e.value._i) {
        let cday = e.value._i.date;
        let cmon = (e.value._i.month + 1);
        const cyear = e.value._i.year;
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
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  closeDialog(txt){
    console.log(txt);
    this.dialogRef.close(txt) 
  }
  deActiveAccount() {
    if (this.data && this.data[1]  && this.data[1].data === 'provider') {
      this.sharedservice.deactiveProviderAccount().subscribe(
        (res: any) => {
          if (res) {
            this.snackbarService.openSnackBar('Account Deleted successfully');
            this.dialogRef.close('afterResClose')
          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    
  }
    else{
      let user;
      if (this.data && this.data[1] && this.data[1].data) {
        user = this.data[1].data;
        console.log('user', user);
        this.beforeDelete = false;
        // this.dialogRef.close('afterResClose')
        setTimeout(() => {
          this.sharedservice.deactiveAccount(user).subscribe((res) => {
            console.log(res);
            if (res) {
              this.dialogRef.close('afterResClose')
            }
          })
        }, 2000);
      }
     }

}
}
