import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../app.component';
import * as moment from 'moment';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-timewindowpopup',
  templateUrl: './timewindowpopup.component.html'
})
export class TimewindowPopupComponent implements OnInit {

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
  start_time_cap = Messages.START_TIME_CAP;
  end_time_cap = Messages.END_TIME_CAP;
  dstart_time;
    dend_time;

  constructor(
    public dialogRef: MatDialogRef<TimewindowPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
  ) {
    this.dstart_time = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
    this.dend_time = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
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
        qstarttimestore: [this.dstart_time, Validators.compose([Validators.required])],
        qendtimestore: [this.dend_time, Validators.compose([Validators.required])],
      });
  }

  onSubmit(form_data) { 
    if (!this.dstart_time || !this.dend_time) {
        this.snackbarService.openSnackBar(Messages.WAITLIST_QUEUE_SELECTTIME, { 'panelClass': 'snackbarerror' });
        return;
    }
    // today
    if (this.sharedfunctionObj.getminutesOfDay(this.dstart_time) > this.sharedfunctionObj.getminutesOfDay(this.dend_time)) {
        this.snackbarService.openSnackBar(Messages.WAITLIST_WINDOW_STIMEERROR, { 'panelClass': 'snackbarerror' });
        return;
    }
    const curdatestore = new Date();
    curdatestore.setHours(this.dstart_time.hour);
    curdatestore.setMinutes(this.dstart_time.minute);
    const enddatestore = new Date();
    enddatestore.setHours(this.dend_time.hour);
    enddatestore.setMinutes(this.dend_time.minute);
    const starttime_format = moment(curdatestore).format('hh:mm A') || null;
    const endtime_format = moment(enddatestore).format('hh:mm A') || null;
    const passingdata =  {
        'sTime': starttime_format,
        'eTime': endtime_format
    };
    this.dialogRef.close(passingdata);

  }
  isNumeric(evt) {
    return this.sharedfunctionObj.isNumeric(evt);
}
isvalid(evt) {
    return this.sharedfunctionObj.isValid(evt);
}
  close() {
      this.dialogRef.close();
  }

  changetime(src, passtime) {
    switch (src) {
        case 'start':
            this.dstart_time = passtime;
            break;
        case 'end':
            this.dend_time = passtime;
            break;
    }
}
}



