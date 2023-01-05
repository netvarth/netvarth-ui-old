import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { MedicalrecordService } from '../medicalrecord.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { Messages } from '../../../../shared/constants/project-messages';



@Component({
    selector: 'app-add-prescription',
    templateUrl: './add-prescription.component.html',
    styleUrls: ['./add-prescription.component.css']
  })
  export class addPrescriptionComponent implements OnInit {
    
  formMode: any;
  rupee_symbol = '₹';
  item_hi_cap = Messages.ITEM_HI_CAP;
  item_name_cap = Messages.ITEM_NAME_CAP;
  short_desc_cap = Messages.SHORT_DESC_CAP;
  detailed_dec_cap = Messages.DETAIL_DESC_CAP;
  price_cap = Messages.PRICES_CAP;
  taxable_cap = Messages.TAXABLE_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  amForm: UntypedFormGroup;
  api_error = '';
  api_success = null;
  parent_id;
  selitem_pic = '';
  char_count = 0;
  max_char_count = 500;
  isfocused = false;
  item_pic = {
    files: [],
    base64: null
  };
  taxpercentage = 0;
  price = 0;
  holdtaxable = false;
  file_error_msg = '';
  img_exists = false;
  maxChars = projectConstantsLocal.VALIDATOR_MAX100;
  maxCharslong = projectConstantsLocal.VALIDATOR_MAX500;
  maxNumbers = projectConstantsLocal.VALIDATOR_MAX10;
  max_num_limit = projectConstantsLocal.VALIDATOR_MAX_LAKH;
  api_loading = true;
  api_loading1 = true;
  disableButton = false;
  userId;
  drugType;
  drugDetail: any =  [];
  listOfDrugs;
  today = new Date();
  mrId;
  fromWhr;
  drugData;
  addAnother = false;
  customerDetails: any;
  serviceName = 'Consultation';
  display_PatientId: any;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  customer_label = '';
  taxDetails: any = [];
    constructor(private location: Location,
      private fb: UntypedFormBuilder,
      public fed_service: FormMessageDisplayService,
      public sharedfunctionObj: SharedFunctions,
      private medicalService: MedicalrecordService,
      private wordProcessor: WordProcessor
      ){
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    }
    ngOnInit(): void {
      this.api_loading = false;
      this.customerDetails = this.medicalService.getPatientDetails();
      if (this.customerDetails.memberJaldeeId) {
        this.display_PatientId = this.customerDetails.memberJaldeeId;
      } else if (this.customerDetails.jaldeeId) {
        this.display_PatientId = this.customerDetails.jaldeeId;
      }
      const servname = this.medicalService.getServiceName();
      if (servname) {
        this.serviceName = servname;
      }
      console.log(this.customerDetails);
      console.log(this.serviceName);
      this.api_loading = false;
      this.createForm();

    }
    
  createForm() {

    this.amForm = this.fb.group({
      medicine_name: ['', Validators.compose([ Validators.maxLength(this.maxChars)])],
      frequency: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
      instructions: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
      duration: [''],
      dosage: ['']
    });

  // if (this.formMode === 'edit') {
  //   this.updateForm();
  // }
  }
    goback(){
      this.location.back();
    }
    onSubmit(form_data) {
      this.api_error = '';
      if(form_data.medicine_name === '' && form_data.frequency === ''&& form_data.dosage === ''&& form_data.instructions === ''&& form_data.duration === ''){
        this.api_error = 'Atleast one field required';
      } else {
      this.drugDetail.push(form_data);
      }
    }
    clearError(event){
      this.api_error = '';
    }
    saveAndAddOther(form_data) {
      console.log(form_data);
      this.api_error = '';
      if(form_data.medicine_name === '' && form_data.frequency === ''&& form_data.dosage === ''&& form_data.instructions === ''&& form_data.duration === ''){
        this.api_error = 'Atleast one field required';
      } else {
      this.drugDetail.push(form_data);
      this.addAnother = true;
      this.clearAll();
    }
    }
    autoGrowTextZone(e) {
      if (e) {
        e.target.style.height = "0px";
        e.target.style.height = (e.target.scrollHeight + 15) + "px";
      }
  
    }
    clearAll() {
      this.amForm.get('medicine_name').setValue('');
      this.amForm.get('frequency').setValue('');
      this.amForm.get('instructions').setValue('');
      this.amForm.get('duration').setValue('');
      this.amForm.get('dosage').setValue('');
    }
    updateForm() {
      this.amForm.setValue({
        'medicine_name': this.drugData.medicine_name || '',
        'frequency': this.drugData.frequency || '',
        'instructions': this.drugData.instructions || '',
        'duration': this.drugData.duration || '',
        'dosage': this.drugData.dosage || ''
      });
    }
  }