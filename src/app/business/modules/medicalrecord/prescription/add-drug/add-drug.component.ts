import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../shared/constants/project-messages';

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
  api_error = null;
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

  constructor(
    public dialogRef: MatDialogRef<AddDrugComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
   // private router: Router,


  ) {
    this.formMode = data.type;
    if (this.formMode === 'edit') {
      console.log(data.drugDetails);
      this.drugData = data.drugDetails;
      console.log(this.drugData);
    }
    this.fromWhr = data.isFrom;
  }
  taxDetails: any = [];
  ngOnInit() {
    this.api_loading = false;
    this.createForm();
  }


  createForm() {

      this.amForm = this.fb.group({
        medicine_name: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
        frequency: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
        instructions: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxCharslong)])],
        duration: ['', Validators.compose([Validators.required])],
        dosage: ['', Validators.compose([Validators.required])]
      });

    if (this.formMode === 'edit') {
      this.updateForm();
    }
  }

  // setDescFocus() {
  //   this.isfocused = true;
  //   this.char_count = this.max_char_count - this.amForm.get('displayDesc').value.length;
  // }
  // lostDescFocus() {
  //   this.isfocused = false;
  // }
  // setCharCount() {
  //   this.char_count = this.max_char_count - this.amForm.get('displayDesc').value.length;
  // }
  updateForm() {
    this.amForm.setValue({
      'medicine_name': this.drugData.medicine_name || null,
      'frequency': this.drugData.frequency || null,
      'instructions': this.drugData.instructions || null,
      'duration': this.drugData.duration || null,
      'dosage': this.drugData.dosage || null
    });
  }

  onSubmit(form_data) {
    console.log(form_data);
    console.log(this.drugDetail);
    this.drugDetail.push(form_data);
    console.log(this.drugDetail);
    this.dialogRef.close(this.drugDetail);

  }
  saveAndAddOther(form_data) {
    this.drugDetail.push(form_data);
    console.log(this.drugDetail);
    this.amForm.reset();
  }





  // // console.log(form_data);
  // //  const drugList = this.medicalRecordService.getDrugList();
  // //  form_data.id = drugList.length + 1;
  // // drugList.push(form_data);
  // // this.dialogRef.close(form_data);
  // }

  // saveDrug(drugdata) {
  //   const drugDetails = [];
  //   let passingDrugdetail;
  // if (this.listOfDrugs.length = 1) {
  //   this.drugType = 'edit';
  //   drugDetails.push(drugdata);
  //   passingDrugdetail = drugDetails;
  // } else if (this.listOfDrugs.length > 1) {
  //   this.listOfDrugs.push(drugdata);
  //   passingDrugdetail = this.listOfDrugs;
  // } else {
  //   drugDetails.push(drugdata);
  //   passingDrugdetail = drugDetails;
  // }
  //   this.disableButton = true;
  //   this.resetApiErrors();
  //   this.api_loading = true;
  //   const passingdata = {
  //     'bookingType': 'NA',
  //     'consultationMode': 'EMAIL',
  //     'prescriptions': passingDrugdetail,
  //     'mrConsultationDate': this.today
  //   };
  //   console.log(passingdata, this.userId);
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: { customerId: this.userId,
  //       }
  // };
  //   if (this.drugType === 'add') {
  //         this.provider_services.createMedicalRecord(passingdata, this.userId).subscribe((data) => {
  //           console.log(data);
  //         this.sharedfunctionObj.setitemonLocalStorage('mrId', data );
  //         this.router.navigate(['/provider/medicalrecords/' + this.userId + '/new-MR/prescription'], navigationExtras);
  //          },
  //          error => {
  //                   this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
  //        });
  //   }  else {
  //     this.mrId = this.sharedfunctionObj.getitemfromLocalStorage('mrId');
  //         this.provider_services.updateMRprescription(passingdata, this.mrId).subscribe((data) => {
  //           console.log(data);
  //         //this.sharedfunctionObj.setitemonLocalStorage('mrId', data );
  //         this.router.navigate(['/provider/medicalrecords/' + this.userId + '/new-MR/prescription'], navigationExtras);
  //           },
  //          error => {
  //                   this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
  //               });
  //   }
  // }

  addDrugtoDrugList() {

  }
}
