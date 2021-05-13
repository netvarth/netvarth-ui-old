import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { S3UrlProcessor } from '../../../shared/services/s3-url-processor.service';
import { Messages } from '../../../shared/constants/project-messages';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { LocalStorageService } from '../../../shared/services/local-storage.service';


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
    "Assamese",
"Bengali",
"Gujarati",
"Hindi",
"Kannada",
"Konkani",
"Malayalam",
"Marathi",
"Manipuri",
"Oriya",
"Punjabi",
"Rajasthani",
"Sanskrit",
"Tamil",
"Telugu",
"Urdu"
  ];
  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VirtualFieldsComponent>,
    private wordProcessor: WordProcessor,
    public fed_service: FormMessageDisplayService,
    private s3Processor: S3UrlProcessor,
    private sharedServices: SharedServices,
    private lStorageService: LocalStorageService) {
    if (data) {
      this.data = this.s3Processor.getJson(data);
    }
  }

  setVirtualFields(userProfile) {
    if (userProfile.pinCode) {

    }
    if (userProfile.gender) {

    }
    if (userProfile.preferredLanguages) {
      this.languages = this.s3Processor.getJson(userProfile);
    }

  }

  ngOnInit(): void {




    this.createForm();
    this.consumer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
  createForm() {
    this.virtualForm = this.fb.group({
      dob: ['', Validators.compose([Validators.required])],
      pincode: ['', Validators.compose([Validators.required])],
      preferredLanguage: [[], Validators.compose([Validators.required])],
      islanguage: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])]
    });
    this.virtualForm.patchValue({ gender: 'male' });
    this.virtualForm.patchValue({ islanguage: 'yes' });
    console.log('here');
    console.log(this.data);
    if (this.data) {
      this.updateForm();
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
  updateForm() {
    this.lngknown = 'yes';
    this.details = this.data;
    console.log(this.details);
    if (this.details && this.details.userProfile) {
      this.virtualForm.patchValue({ dob: this.details.userProfile.dob });
      this.virtualForm.patchValue({ gender: this.details.userProfile.gender });
    }
    if (this.details && this.details.userProfile && this.details.userProfile.preferredLanguages) {
      let defaultEnglish = (this.details.userProfile.preferredLanguages && this.s3Processor.getJson(this.details.userProfile.preferredLanguages)[0] === 'English') ? 'yes' : 'no';
      this.virtualForm.patchValue({ islanguage: defaultEnglish });
      this.lngknown = defaultEnglish;
      this.virtualForm.patchValue({ preferredLanguage: this.s3Processor.getJson(this.details.userProfile.preferredLanguages) });
    }
    if (this.details && this.details.userProfile && this.details.userProfile.pinCode) {
      this.virtualForm.patchValue({ pincode: this.details.userProfile.pinCode });
      this.showLocations(this.details.userProfile.pinCode);
    }
    // this.selectedLocation = this.details.location;


    // this.virtualForm.patchValue({
    //   dob: dob,
    //   pincode: usr_pincode,
    //   preferredLanguage: islanguage,
    //   islanguage: defaultEnglish,
    //   gender: gender
    // });
  }
  validateFields() {
    if (this.virtualForm.get('pincode').value === '' || this.virtualForm.get('pincode').value.length !== 6) {
      return true;
    }
    console.log(this.virtualForm.get('dob').value);
    if (this.virtualForm.get('dob').value === '') {
      return true;
    }
    if (this.lngknown === 'no') {
      console.log(this.virtualForm.get('preferredLanguage').value);
      if (this.virtualForm.get('preferredLanguage').value.length === 0) {
        return true;
      }
    }
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
    console.log(event);
    let pincode = this.virtualForm.get('pincode').value;
    console.log(pincode);
    if (pincode.length === 6) {
      this.loading = true;
      console.log(pincode);
      this.fetchLocationByPincode(pincode).then(
        (locations: any) => {
          if (locations.length > 0) {
            this.locations = locations[0];
            this.virtualForm.patchValue({ location: locations[0]['PostOffice'][0] });
            console.log(this.locations);
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
    console.log(formdata);
    if (this.lngknown === 'yes') {
      formdata['preferredLanguage'] = ["English"];
    }
    this.lStorageService.setitemonLocalStorage('customerInfo', formdata);
    this.dialogRef.close(formdata)

  }
  onChange(event) {

    console.log(event.value);
    this.lngknown = event.value

  }

}