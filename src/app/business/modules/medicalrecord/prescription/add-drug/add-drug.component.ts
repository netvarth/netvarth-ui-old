import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../shared/constants/project-messages';
import { MedicalrecordService } from '../../medicalrecord.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-add-drug',
  templateUrl: './add-drug.component.html',
  styleUrls: ['./add-drug.component.css']
})
export class AddDrugComponent implements OnInit {

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
  amForm: FormGroup;
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
  maxChars = projectConstantsLocal.VALIDATOR_MAX50;
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

  constructor(
    public dialogRef: MatDialogRef<AddDrugComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private medicalService: MedicalrecordService,
    private wordProcessor: WordProcessor,
  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.formMode = data.type;
    if (this.formMode === 'edit') {
      this.drugData = data.drugDetails;
    }
    this.fromWhr = data.isFrom;
  }
  taxDetails: any = [];
  ngOnInit() {
    this.customerDetails = this.medicalService.getPatientDetails();
    if (this.customerDetails.memberJaldeeId) {
      this.display_PatientId = this.customerDetails.memberJaldeeId;
    } else if (this.customerDetails.jaldeeId) {
      this.display_PatientId = this.customerDetails.jaldeeId;
    }
    const servname = this.medicalService.getServiceName();
    if(servname){
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

    if (this.formMode === 'edit') {
      this.updateForm();
    }
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

  onSubmit(form_data) {
    console.log(form_data);
    this.api_error = '';
    if(form_data.medicine_name === '' && form_data.frequency === ''&& form_data.dosage === ''&& form_data.instructions === ''&& form_data.duration === ''){
      this.api_error = 'Atleast one field required';
    } else {
    this.drugDetail.push(form_data);
    this.dialogRef.close(this.drugDetail);
    }
  }
  clearError(event){
    this.api_error = '';
  }
  close() {
    if (this.addAnother === true) {
      this.dialogRef.close(this.drugDetail);
    } else {
      this.dialogRef.close();
    }
    
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
    //this.amForm.reset();
  }
  }
  clearAll() {
    this.amForm.get('medicine_name').setValue('');
    this.amForm.get('frequency').setValue('');
    this.amForm.get('instructions').setValue('');
    this.amForm.get('duration').setValue('');
    this.amForm.get('dosage').setValue('');
  }



}



