import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import {SharedServices} from '../../services/shared-services';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-consumer-rate-service-popup',
  templateUrl: './consumer-rate-service-popup.html'
})
export class ConsumerRateServicePopupComponent implements OnInit {

  api_error = null;
  api_success = null;
  message = null;
  rate_value = 0;
  waitlist = null;
  newrating = true;
  load_complete = false;

  rate_your_visit = Messages.RATE_YOU_VISIT;
  rate_cap = Messages.RATING_CAP;
  message_cap = Messages.MESSAGE_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  rate_btn_cap = Messages.RATE_BTN_CAP;

  constructor(
    public dialogRef: MatDialogRef<ConsumerRateServicePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
      this.waitlist = data;
     }

  ngOnInit() {
    this.getRateByUser();
  }

  getRateByUser() {
    const params = {
      account : this.waitlist.provider.id,
      'uId-eq' : this.waitlist.ynwUuid
    };

    this.shared_services.getConsumerRateService(params)
    .subscribe(
      data => {
        if (data[0]) {
          if (data[0]['feedback'].length > 0) {
            this.message = data[0]['feedback'][(data[0]['feedback'].length - 1)]['comments'];
          } else {
            this.message = '';
          }
          this.rate_value = data[0]['stars'];
          this.newrating = false;
        }
        this.load_complete = true;
      },
      error => {
        this.load_complete = true;
      });
  }

  setRate() {

    this.resetApiErrors();

    const params = {
      account : this.waitlist.provider.id
    };

    const post_data = {
      'uuid': this.waitlist.ynwUuid,
      'stars': this.rate_value,
      'feedback': this.message
    };

    if (this.newrating) {
      this.addRateService(params, post_data);
    } else {
      this.updateRateService(params, post_data);
    }
  }

  addRateService(params, post_data ) {

    this.shared_services.postConsumerRateService(params, post_data)
    .subscribe(
      data => {
        this.sharedfunctionObj.apiSuccessAutoHide(this, Messages.SERVICE_RATE_UPDATE);
        setTimeout( () => {
          this.dialogRef.close('reloadlist');
        } , projectConstants.TIMEOUT_DELAY);
      },
      error => {
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
      });
  }

  updateRateService(params, post_data ) {

    this.shared_services.updateConsumerRateService(params, post_data)
    .subscribe(
      data => {
        this.sharedfunctionObj.apiSuccessAutoHide(this, Messages.SERVICE_RATE_UPDATE);
        setTimeout( () => {
          this.dialogRef.close('reloadlist');
        } , projectConstants.TIMEOUT_DELAY);
        // this.dialogRef.close('reloadlist');
      },
      error => {
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
     });
   }

  handleratingClick(val) {
    this.rate_value = val.selectedrating;
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }
  /*checkDisablebutton() {
    if (this.message) {
      const msg = this.message.trim();
      if (this.rate_value === 0 || msg === '' || msg === undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }*/

  checkDisablebutton() {
    if (this.rate_value === 0) {
      return true;
    } else {
      return false;
    }
  }


}
