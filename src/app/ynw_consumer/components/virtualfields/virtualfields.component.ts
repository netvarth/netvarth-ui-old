import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { S3UrlProcessor } from '../../../shared/services/s3-url-processor.service';
import { Messages } from '../../../shared/constants/project-messages';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { SubSink } from 'subsink';
import * as moment from 'moment';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { projectConstantsLocal } from '../../../../app/shared/constants/project-constants';
// import { SharedFunctions } from '../../../../app/shared/functions/shared-functions';






@Component({
  selector: 'app-virtualfields',
  templateUrl: './virtualfields.component.html',
  styleUrls: ['./virtualfields.component.css']
})

export class VirtualFieldsComponent implements OnInit {
  lngknown = 'yes';
  virtualForm: FormGroup;
  details: any;
  gender_cap = Messages.GENDER_CAP;
  selectedLocation;
  locations;
  consumer_label: any;
  disableButton;
  loading = false;
  languages = [
    "Hindi",
    "Kannada",
    "Malayalam",
    "Tamil",
    "Telugu"
  ];
  hideLanguages = true;
  api_loading = true;
  api_loading1 = true;
  customer_data: any;
  familymembers: any[];
  new_member;
  private subs = new SubSink();
  is_parent = true;
  chosen_person: any;
  maxDate = moment(new Date()).format('YYYY-MM-DD')
  consumerType = '';
  activeUser: any;
  memberObject: any;
  theme: any;
  selectedDate: number;
  selectedMonth: number;
  selectedYear: number;

  allDates: any[] = [];
  dates: any[] = [];
  years: number[] = [];
  months: { value: string; name: string; }[];
  mob_prefix_cap = '+91';
  mandatoryEmail: any;
  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<VirtualFieldsComponent>,
    private wordProcessor: WordProcessor,
    public fed_service: FormMessageDisplayService,
    private s3Processor: S3UrlProcessor,
    private sharedServices: SharedServices,
    // private shared_functions:SharedFunctions,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService
  ) {
    this.months = projectConstantsLocal.MONTH;
    for (let i = 1; i <= 31; i++) {
      if (i < 10) {
        this.allDates.push('0' + i);
      } else {
        this.allDates.push(i);
      }
    }
    // for (let i = 1; i <= 12; i++) {
    //   this.months.push(i);
    // }
    for (let i = 1900; i <= 2021; i++) {
      this.years.push(i);
    }
    this.dates = this.allDates;
    if (dialogData) {
      if (dialogData.consumer) {
        this.dialogData = this.s3Processor.getJson(dialogData.consumer);
      } else {
        this.dialogData = this.s3Processor.getJson(dialogData);
      }
      if (dialogData.theme) {
        this.theme = dialogData.theme;
      }

    }
    this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getActiveUserInfo().then(data => {
      this.customer_data = data;
      this.mandatoryEmail=this.customer_data.userProfile.email;
      this.createForm();
      this.getFamilyMembers();
    });




  }
  // isNumeric(evt) {
  //   return this.shared_functions.isNumeric(evt);
  // }
  ngOnInit(): void {


    this.consumer_label = this.wordProcessor.getTerminologyTerm('customer');
    // this.getFamilyMembers();
  }
  getActiveUserInfo() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.sharedServices.getProfile(_this.activeUser.id, 'consumer')
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });

  }
  getFamilyMembers() {
    this.api_loading1 = true;
    let fn;
    fn = this.sharedServices.getConsumerFamilyMembers();
    this.subs.sink = fn.subscribe(data => {
      this.familymembers = [];
      for (const mem of data) {
        this.familymembers.push(mem);
      }
      if (this.dialogData.id) {
        this.virtualForm.patchValue({ 'serviceFor': this.dialogData.id });
        this.onServiceForChange(this.dialogData.id);
      }
      this.api_loading1 = false;
    },
      () => {
        this.api_loading1 = false;
      });
  }
  onServiceForChange(event) {
    this.serviceFormReset();
    this.is_parent = true;
    if (event !== 'new_member') {
      const chosen_Object = this.familymembers.filter(memberObj => memberObj.user === event);
      if (chosen_Object.length !== 0) {
        this.is_parent = false;
        this.chosen_person = chosen_Object[0]
        this.setMemberDetails(chosen_Object[0]);
      } else {
        this.chosen_person = this.customer_data
        this.setparentDetails(this.customer_data);
      }
    } else {
      this.is_parent = false;
      this.chosen_person = 'new_member'
  
    }

  }
  checkMainMemberEmailId() {
    let isemail=false;
    console.log(this.mandatoryEmail);
    if(this.mandatoryEmail==='' && this.virtualForm.get('email').value===''){
      isemail=false;
    }else if(this.mandatoryEmail==='' &&this.virtualForm.get('email').value!==''){
      this.updateParentInfo(this.virtualForm.value).then(
        (result) => {
          console.log('updatedSucessfully');
          isemail=true;
          this.getActiveUserInfo();
        });
    }else{
      isemail=true;
    }
    console.log(isemail);
    return isemail;
  }

  setMemberDetails(memberObj) {
    this.serviceFormReset();
    if (memberObj.userProfile && memberObj.userProfile.dob!==undefined) {
      const dob = memberObj.userProfile.dob.split('-');
      this.virtualForm.patchValue({ date: dob[2] });
      this.virtualForm.patchValue({ month: dob[1] });
      this.virtualForm.patchValue({ year: dob[0] });
      this.virtualForm.patchValue({ dob: memberObj.userProfile.dob });
    }else{
      this.virtualForm.patchValue({ date: 'dd' });
      this.virtualForm.patchValue({ month:'mm' });
      this.virtualForm.patchValue({ year: 'yyyy' });
    }
    if (memberObj.userProfile && memberObj.userProfile.gender) {
      this.virtualForm.patchValue({ gender: memberObj.userProfile.gender });
    } else {
      this.virtualForm.patchValue({ gender: 'male' });
    }
    if (memberObj.userProfile && memberObj.userProfile.email) {
      this.virtualForm.patchValue({ email: memberObj.userProfile.email });
    }
    if (memberObj.preferredLanguages && memberObj.preferredLanguages !== null) {
      const preferredLanguage = this.s3Processor.getJson(memberObj.preferredLanguages);
      if (preferredLanguage !== null && preferredLanguage.length > 0) {
        let defaultEnglish = (preferredLanguage[0] === 'English') ? 'yes' : 'no';
        if (defaultEnglish === 'no') {
          if (memberObj.preferredLanguages.length > 0) {
            this.virtualForm.patchValue({ islanguage: defaultEnglish });
            this.lngknown = defaultEnglish;
          } else {
            this.virtualForm.patchValue({ islanguage: '' });
          }
        } else {
          this.virtualForm.patchValue({ islanguage: defaultEnglish });
          this.lngknown = defaultEnglish;
        }
        this.virtualForm.patchValue({ preferredLanguage: preferredLanguage });
      }
    } else {
      this.virtualForm.patchValue({ islanguage: 'yes' });
    }
    if (memberObj.bookingLocation && memberObj.bookingLocation.pincode) {
      this.virtualForm.patchValue({ pincode: memberObj.bookingLocation.pincode });
    }
    if (memberObj.userProfile && memberObj.userProfile.whatsAppNum) {
      this.virtualForm.patchValue({ whatsappnumber: memberObj.userProfile.whatsAppNum.number });
    }
    if (memberObj.userProfile && memberObj.userProfile.telegramNum) {
      this.virtualForm.patchValue({ telegramnumber: memberObj.userProfile.telegramNum.number });
    }
  }
  serviceFormReset() {

    this.virtualForm.patchValue({ date: 'dd' });
      this.virtualForm.patchValue({ month:'mm' });
      this.virtualForm.patchValue({ year: 'yyyy' });
    this.virtualForm.controls['dob'].setValue('');
    this.virtualForm.controls['gender'].setValue('male');
    this.virtualForm.controls['islanguage'].setValue('yes');
    this.virtualForm.controls['preferredLanguage'].setValue([]);
    this.virtualForm.controls['pincode'].setValue('');
    this.virtualForm.controls['location'].setValue('');
    this.virtualForm.patchValue({ email: '' });
    this.virtualForm.patchValue({ whatsappnumber: '' });
    this.virtualForm.patchValue({ telegramnumber: '' });
  }
  setparentDetails(customer) {
  

    
    if (customer.userProfile && customer.userProfile.dob!==undefined) {

      const dob = customer.userProfile.dob.split('-');
      this.virtualForm.patchValue({ date: dob[2] });
      this.virtualForm.patchValue({ month: dob[1] });
      this.virtualForm.patchValue({ year: dob[0] });
      this.virtualForm.patchValue({ dob: customer.userProfile.dob });
    }else{
      this.virtualForm.patchValue({ date:'dd' });
      this.virtualForm.patchValue({ month: 'mm' });
      this.virtualForm.patchValue({ year: 'yyyy' });
    }
    if (customer.userProfile && customer.userProfile.gender) {
      this.virtualForm.patchValue({ gender: customer.userProfile.gender });
    } else {
      this.virtualForm.patchValue({ gender: 'male' });
    }
    if (customer.userProfile && customer.userProfile.email) {
      this.virtualForm.patchValue({ email: customer.userProfile.email });
    }
    if (customer.userProfile.preferredLanguages && customer.userProfile.preferredLanguages !== null) {
      const preferredLanguage = this.s3Processor.getJson(customer.userProfile.preferredLanguages);
      if (preferredLanguage !== null && preferredLanguage.length > 0) {
        let defaultEnglish = (preferredLanguage[0] === 'English') ? 'yes' : 'no';
        this.virtualForm.patchValue({ islanguage: defaultEnglish });
        this.lngknown = defaultEnglish;
        this.virtualForm.patchValue({ preferredLanguage: preferredLanguage });
      } else {
        this.virtualForm.patchValue({ islanguage: 'yes' });
      }
    }
    if (customer.userProfile && customer.userProfile.pinCode) {
      this.virtualForm.patchValue({ pincode: customer.userProfile.pinCode });
    }
    if (customer.userProfile && customer.userProfile.whatsAppNum) {
      this.virtualForm.patchValue({ whatsappnumber: customer.userProfile.whatsAppNum.number });
    }
    if (customer.userProfile && customer.userProfile.telegramNum) {
      this.virtualForm.patchValue({ telegramnumber: customer.userProfile.telegramNum.number });
    }

  }
  createForm() {
    this.virtualForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      serviceFor: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([Validators.required])],
      date: [''],
      month: [''],
      year: [''],
      pincode: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
      whatsappnumber: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10)])],
      telegramnumber: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10)])],
      preferredLanguage: [[], Validators.compose([Validators.required])],
      islanguage: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])]
    });
    this.virtualForm.patchValue({ gender: 'male' });
    this.virtualForm.patchValue({ islanguage: 'yes' });
    this.virtualForm.patchValue({ date: 'dd' });
    this.virtualForm.patchValue({ month:'mm' });
    this.virtualForm.patchValue({ year: 'yyyy' });
    if (this.dialogData.type !== 'member') {
      this.virtualForm.patchValue({ serviceFor: this.customer_data.id });
    } else {
      this.virtualForm.patchValue({ serviceFor: this.dialogData.consumer });

    }

    if (this.dialogData) {
      console.log('dialogData');
      this.updateForm();
    }
    this.api_loading = false;
  }
  closeDialog() {
    this.dialogRef.close();
  }
  editLanguage() {
    this.hideLanguages = false;
  }
  updateForm() {
    if (this.dialogData.type && this.dialogData.type === 'member') {
      this.details = this.dialogData.consumer
    } else {
      this.details = this.customer_data;
    }
    if (this.details.parent) {
      this.setMemberDetails(this.details);
    } else {
      this.setparentDetails(this.details);
    }

  }
  saveLanguages() {
    if (this.virtualForm.get('preferredLanguage').value.length === 0) {
      return false;
    }
    this.hideLanguages = true;
    let elmnt = document.getElementById("plng");
    elmnt.scrollIntoView();
  }
  cancelLanguageSelection() {
    this.hideLanguages = true;
    this.updateForm();
    let elmnt = document.getElementById("plng");
    elmnt.scrollIntoView();
  }
  langSel(sel) {
    if (this.virtualForm.get('preferredLanguage').value.length > 0) {
      const existindx = this.virtualForm.get('preferredLanguage').value.indexOf(sel);
      if (existindx === -1) {
        this.virtualForm.get('preferredLanguage').value.push(sel);
      } else {
        this.virtualForm.get('preferredLanguage').value.splice(existindx, 1);
      }
    } else {
      this.virtualForm.get('preferredLanguage').value.push(sel);
    }
  }
  checklangExists(lang) {
    if (this.virtualForm.get('preferredLanguage').value.length > 0) {
      const existindx = this.virtualForm.get('preferredLanguage').value.indexOf(lang);
      if (existindx !== -1) {
        return true;
      }
    } else {
      return false;
    }
  }
  validateFields() {
    let isinvalid = false;
    if (this.virtualForm.get('pincode').value === '' || this.virtualForm.get('pincode').value.length !== 6) {
      isinvalid = true;
    }
    // if (this.virtualForm.get('dob').value === '') {
    //   isinvalid = true;
    // }
    if (this.virtualForm.get('islanguage').value === 'no') {
      if (this.virtualForm.get('preferredLanguage').value.length === 0) {
        isinvalid = true;
      }
    }
    if (this.virtualForm.get('serviceFor').value === 'new_member') {

      if (this.virtualForm.get('firstName').value == '') {
        isinvalid = true;
      }
      if (this.virtualForm.get('lastName').value == '') {
        isinvalid = true;
      }
    }
    if (this.virtualForm.get('date').value === 'dd') {
      isinvalid = true;
    }
    if (this.virtualForm.get('month').value === 'mm') {
      isinvalid = true;
    }
    if (this.virtualForm.get('year').value === 'yyyy') {
      isinvalid = true;
    }

    return isinvalid;
  }

  fetchLocationByPincode(pincode) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.sharedServices.getLocationsByPincode(pincode).subscribe(
        (locations: any) => {
          resolve(locations);
        },
        error => {
          resolve([]);
        }
      );
    });
  }

  showLocations(event) {
    let pincode = this.virtualForm.get('pincode').value;
    if (pincode.length === 6) {
      this.loading = true;
      this.fetchLocationByPincode(pincode).then(
        (locations: any) => {
          if (locations.length > 0) {
            this.locations = locations[0];
            this.virtualForm.patchValue({ location: locations[0]['PostOffice'][0] });
          } else {
            this.locations = [];
          }
          this.loading = false;
        }
      )
    } else {
      this.locations = [];
    }
  }

  onSubmit(formdata) {
    if (this.validateFields() === true) {
      this.snackbarService.openSnackBar('Please fill all required fields', { 'panelClass': 'snackbarerror' });
    } else {
      const dob = this.virtualForm.get('year').value + '-' + this.virtualForm.get('month').value + '-' + this.virtualForm.get('date').value;

      formdata['dob'] = dob;
      if (this.is_parent) {
        console.log(formdata);
        this.updateParentInfo(formdata).then(
          (result) => {
            if (result !== false) {
              this.dialogRef.close(formdata);
            }
          },
          (error) => {
            return false;
          }
        );
      } else {
        console.log(formdata);
        if (formdata.serviceFor === 'new_member') {
          this.saveMember(formdata).then(data => {
            if (data !== false) {
              formdata['newMemberId'] = data;
              this.dialogRef.close(formdata);
            }
          },
            () => {
              return false;
            })
        } else {
          this.updateMemberInfo(formdata).then(
            (data) => {
              if (data !== false) {
                this.dialogRef.close(formdata);
              }
            },
            () => {
              return false;
            }
          );
        }


      }

    }



  }
  updateParentInfo(formdata) {
    console.log(formdata);
    const _this = this;
    const firstName = _this.customer_data.userProfile.firstName
    const lastName = _this.customer_data.userProfile.lastName;
    return new Promise(function (resolve, reject) {
      const userObj = {};
      userObj['id'] = _this.customer_data.id;
      if (formdata.whatsappnumber !== '') {
        const whatsup = {}
        whatsup["countryCode"] = '+91',
          whatsup["number"] = formdata.whatsappnumber
        userObj['whatsAppNum'] = whatsup;
      }
      if (formdata.telegramnumber !== '') {
        const telegram = {}
        telegram["countryCode"] = '+91',
          telegram["number"] = formdata.telegramnumber
        userObj['telegramNum'] = telegram;
      }
      // const userProfile = {}
      if(formdata.email!==''){
        userObj['email']=formdata.email
      }
      userObj['gender'] = formdata.gender;
      userObj['firstName'] = firstName;
      userObj['lastName'] = lastName;
      userObj['dob'] = formdata.dob;
      userObj['pinCode'] = formdata.pincode;
      console.log(formdata.islanguage);
      if (formdata.islanguage === 'yes') {
        userObj['preferredLanguages'] = ['English'];
      } else {
        userObj['preferredLanguages'] = formdata.preferredLanguage;
      }
      // userObj['userProfile'] = userProfile;
      console.log(userObj);
      _this.sharedServices.updateProfile(userObj, 'consumer').subscribe(
        () => {
          resolve(true);
        }, (error) => {
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          resolve(false);
        }
      )
    });
  }

  updateMemberInfo(formdata) {
    const _this = this;
    console.log(_this.chosen_person);
    const firstName = _this.chosen_person.userProfile.firstName;
    const lastName = _this.chosen_person.userProfile.lastName;
    let memberInfo: any = {};
    memberInfo.userProfile = {}
    if (formdata.whatsappnumber !== '') {
      const whatsup = {}
      whatsup["countryCode"] = '+91',
        whatsup["number"] = formdata.whatsappnumber
      memberInfo.userProfile['whatsAppNum'] = whatsup;
    }
    if (formdata.telegramnumber !== '') {
      const telegram = {}
      telegram["countryCode"] = '+91',
        telegram["number"] = formdata.telegramnumber
      memberInfo.userProfile['telegramNum'] = telegram;
    }
    if(formdata.email!==''){
      memberInfo['userProfile']['email']=formdata.email
    }
   
    memberInfo.bookingLocation = {}
    memberInfo.userProfile['id'] = formdata.serviceFor;
    memberInfo.userProfile['gender'] = formdata.gender;
    memberInfo.userProfile['firstName'] = firstName;
    memberInfo.userProfile['lastName'] = lastName;
    memberInfo.userProfile['dob'] = formdata.dob;
    memberInfo.bookingLocation['pincode'] = formdata.pincode;
    if (formdata.islanguage === 'yes') {
      memberInfo['preferredLanguages'] = ['English'];
    } else {
      memberInfo['preferredLanguages'] = formdata.preferredLanguage;
    }

    if (formdata.location.State && formdata.location.Name) {
      memberInfo.bookingLocation['state'] = formdata.location.State;
      memberInfo.bookingLocation['city'] = formdata.location.Name
    }
    return new Promise(function (resolve, reject) {

      console.log(memberInfo);
      _this.sharedServices.editMember(memberInfo).subscribe(
        () => {
          resolve(true);
        }, (error) => {
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          resolve(false);
        }
      )
    });



  }
  saveMember(formdata) {
    const _this = this;
    const memberInfo = {};
    memberInfo['userProfile'] = {}
    if (formdata.whatsappumber !== '') {
      const whatsup = {}
      whatsup["countryCode"] = '+91',
        whatsup["number"] = formdata.whatsappumber
      memberInfo['userProfile']['whatsAppNum'] = whatsup;
    }
    if (formdata.telegramnumber !== '') {
      const telegram = {}
      telegram["countryCode"] = '+91',
        telegram["number"] = formdata.telegramnumber
        memberInfo['userProfile']['telegramNum'] = telegram;
    }
    if(formdata.email!==''){
      memberInfo['userProfile']['email']=formdata.email
    }


    memberInfo['bookingLocation'] = {}
    memberInfo['userProfile']['gender'] = formdata.gender;
    memberInfo['userProfile']['firstName'] = formdata.firstName;
    memberInfo['userProfile']['lastName'] = formdata.lastName;
    memberInfo['userProfile']['dob'] = formdata.dob;
    memberInfo['bookingLocation']['pincode'] = formdata.pincode;
    if (formdata.islanguage === 'yes') {
      memberInfo['preferredLanguages'] = ['English'];
    } else {
      memberInfo['preferredLanguages'] = formdata.preferredLanguage;
    }

    if (formdata.location.State && formdata.location.Name) {
      memberInfo['bookingLocation']['state'] = formdata.location.State;
      memberInfo['bookingLocation']['city'] = formdata.location.Name
    }
    return new Promise(function (resolve, reject) {

      console.log(memberInfo);
      _this.sharedServices.addMembers(memberInfo).subscribe(
        (data) => {
          resolve(data);
        }, (error) => {
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          resolve(false);
        }
      )
    });


  }
  onChange(event) {
    this.lngknown = event.value
    if (this.lngknown === 'yes') {
      this.virtualForm.get('preferredLanguage').setValue(['English']);
    }
    if (this.lngknown === 'no' && this.virtualForm.get('preferredLanguage').value.length === 0) {
      this.hideLanguages = false;
    }
    if (this.lngknown === 'no' && this.virtualForm.get('preferredLanguage').value.length > 0 && this.virtualForm.get('preferredLanguage').value[0] === 'English') {
      this.virtualForm.get('preferredLanguage').setValue([]);
      this.hideLanguages = false;
    }
  }
}
