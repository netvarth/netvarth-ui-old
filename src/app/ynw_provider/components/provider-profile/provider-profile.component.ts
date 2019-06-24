import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html'
})

export class ProviderProfileComponent implements OnInit, OnDestroy {

  profile_pic_cap = Messages.PROFILE_PICTURE_CAP;
  mobile_cap = Messages.CUSTOMER_MOBILE_CAP;
  email_cap = Messages.SERVICE_EMAIL_CAP;
  description_cap = Messages.DESCRIPTION_MAND_CAP;
  next_cap = Messages.NEXT_CAP;
  address_cap = Messages.ADDRESS_CAP;
  done_cap = Messages.DONE_BTN;
  profile_cap = Messages.PROFILE_CAP;
  bus_name_cap = Messages.BUS_NAME_CAP;
  short_name_cap = Messages.SHORT_NAME_CAP;
  loc_schedule_info = Messages.LOC_SCHEDULE_INFO;
  pin_code_cap = Messages.PINCODE_CAP;
  place_cap = Messages.PLACE_CAP;
  coordinates_cap = Messages.COORDINATES_CAP;
  back_cap = Messages.BACK_CAP;
  now_done_cap = Messages.NOW_DONE_CAP;
  @ViewChild('ckeditor') ckeditor: ElementRef;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  s3url = null;
  provider_id = null;
  basic_profile;
  selected_index = 0;
  terminologies;
  profile_pic = {
    files: [],
    base64: null
  };
  location_data;
  public options: Object = {
    placeholderText: 'Add Description here',
    charCounterCount: false
  };
  toolbar = projectConstants.TOOLBAR_CONFIG;
  files;
  subscription;
  ckeditorLoaded = false;

  constructor(private fb: FormBuilder,
    private shared_functions: SharedFunctions,
    private shared_services: SharedServices,
    private provider_services: ProviderServices,
    public fed_service: FormMessageDisplayService) {

    if (!window['CKEDITOR']) {
      const url = '//cdn.ckeditor.com/4.7.3/full/ckeditor.js';
      const script = document.createElement('script');
      script.onload = () => {
        this.ckeditorLoaded = true;
      };
      script.type = 'text/javascript';
      script.src = url;
      document.body.appendChild(script);
    }
  }

  ngOnInit() {
    this.firstFormGroup = this.fb.group({
      business_name: ['', Validators.required],
      short_name: [''],
      mobile: [{ value: '', disabled: true }],
      email: ['', Validators.compose([Validators.email])],
      business_desc: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      place: ['', Validators.required],
      address: [''],
      pincode: [''],
      coordinates: ['', Validators.required],
    });

    this.shared_functions.getS3Url('provider')
      .then(
        data => {
          this.s3url = data;
        }
      );

    this.stepInitFun();

  }

  stepChange(stepper) {
    setTimeout(() => {
      this.selected_index = stepper.selectedIndex;
      this.stepInitFun();
    }, 100);
  }

  stepInitFun() {

    switch (this.selected_index) {
      case 0: this.basicProfileInit(); break;
      case 1: this.profileLocationInit(); break;
    }
  }

  imageUpload(input) {

    if (input.files && input.files[0]) {
      const reader = new FileReader();
      this.profile_pic.files = input.files[0];
      reader.onload = (e) => {
        this.profile_pic.base64 = e.target['result'];
      };

      reader.readAsDataURL(input.files[0]);
    }

  }
  basicProfileInit() {
    this.provider_services.getBussinessProfile()
      .subscribe(
        data => {
          this.basic_profile = data;
          this.provider_id = this.basic_profile.uniqueId || null;
          const user = JSON.parse(localStorage.getItem('ynw-user'));
          this.getTerminologies();
          this.firstFormGroup.setValue(
            {
              'business_name': this.basic_profile.businessName || null,
              'email': this.basic_profile.email || null,
              'mobile': this.basic_profile.primaryPhoneNo || user.primaryPhoneNumber || null,
              'short_name': this.basic_profile.shortName || null,
              'business_desc': this.basic_profile.businessDesc || null
            }
          );

        },
        () => {

        }
      );

  }

  getTerminologies() {

    if (!this.s3url || !this.provider_id) {
      return false;
    }

    const UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
    this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, 'terminologies', UTCstring)
      .subscribe(res => {
        this.terminologies = res;
      }
      );

  }

  profileLocationInit() {
  }
  getLocation(event) {

    const criteria = event.target.value;
    if (event.keyCode >= 16 && event.keyCode <= 45) {
      return false;
    }

    if (criteria !== '') {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      // Creating criteria to be passed via get
      const pass_criteria = {
        'criteria': criteria
      };
      this.subscription = this.shared_services.GetsearchLocation(pass_criteria)
        .subscribe(res => {
          this.location_data = res;
          if (!res[0]) { this.setNulllocationvalues(); }
        });
    } else {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.location_data = [];
    }
  }

  setNulllocationvalues() {

    this.secondFormGroup.patchValue({ 'coordinates': null });
    this.location_data = [];
  }

  setLocation(loc) {
    if (!loc || !loc.name) {
      return false;
    }
    this.secondFormGroup.patchValue({ 'place': loc.name });
    this.secondFormGroup.patchValue({ 'coordinates': loc.latitude + ',' + loc.longitude });
  }

  checkLocation() {
    if (this.location_data && this.location_data[0] &&
      this.secondFormGroup.get('place').value !== this.location_data[0].name) {
      this.setLocation(this.location_data[0]);
    } else if (!this.location_data || this.location_data.length === 0) {
      this.setNulllocationvalues();
      this.secondFormGroup.patchValue({ 'place': null });
    }
  }

  displayFn(val) {
    if (val && val.name) {
      this.setLocation(val);
      return val.name;
    } else {
      return val;
    }


  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (window['CKEDITOR']) {
      window['CKEDITOR'].removeAllListeners(); this.ckeditorLoaded = false;
    }

  }

}
