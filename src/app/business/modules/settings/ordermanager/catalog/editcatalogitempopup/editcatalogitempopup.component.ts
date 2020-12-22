import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../../shared/constants/project-messages';

@Component({
  selector: 'app-edit-catalogitem',
  templateUrl: './editcatalogitempopup.component.html'
})
export class EditcatalogitemPopupComponent implements OnInit {

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
  cataId;
  fromWhr;
  minimumquantity;
  maximumquantity
  addAnother = false;

  constructor(
    public dialogRef: MatDialogRef<EditcatalogitemPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
  ) {
    this.cataId = data.id;
    this.minimumquantity = data.minquantity;
    this.maximumquantity = data.maxquantity;
  }
  
  ngOnInit() {
    this.api_loading = false;
    this.createForm();
  }


  createForm() {

      this.amForm = this.fb.group({
        maxquantity: ['', Validators.compose([Validators.required])],
        minquantity: ['', Validators.compose([Validators.required])]
      });
      this.amForm.get('maxquantity').setValue(this.maximumquantity);
      this.amForm.get('minquantity').setValue(this.minimumquantity);
  }

  

  onSubmit(form_data) {
    this.dialogRef.close(form_data);

  }
  close() {
      this.dialogRef.close();
  }
  




}



