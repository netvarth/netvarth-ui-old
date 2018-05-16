import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import {Messages} from '../../constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
})
export class CheckInComponent implements OnInit {

    s3url;
    provider_id;
    api_success = null;
    api_error = null;
    servicesjson: any = [];
    galleryjson: any = [];
    settingsjson: any = [];
    locationjson: any = [];
    queuejson: any = [];
    sel_loc;
    sel_ser;
    sel_ser_det: any = [];
    sel_que;
    search_obj;
    checkinenable = false;
    checkindisablemsg = '';
    pass_loc;
    sel_queue_id;
    sel_queue_waitingmins;
    sel_queue_name;
    sel_queue_det;
    showfuturediv;
    revealphonenumber;
    today;
    minDate;
    maxDate;
    consumerNote;
    sel_checkindate;
    account_id;
    retval;
    futuredate_allowed = false;
    step;
    waitlist_for;
    loggedinuser;
    constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public sharedFunctionobj: SharedFunctions,
    public router: Router,
    public dialogRef: MatDialogRef<CheckInComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
     console.log('check-inpassed data', data);
    }

    ngOnInit() {
      this.step = 1;
      this.loggedinuser = this.sharedFunctionobj.getitemfromLocalStorage('ynw-user');
      this.gets3curl();
      this.consumerNote = '';
      this.today = new Date();
      this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
      this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
      this.search_obj = this.data.srchprovider;
      this.provider_id = this.search_obj.fields.unique_id;
      const providarr = this.search_obj.id.split('-');
      this.account_id = providarr[0];
      this.waitlist_for = {id: this.loggedinuser.id, name: 'Self'};
      this.sel_queue_id = this.search_obj.fields.waitingtime_res.nextAvailableQueue.id;
      // this.sel_queue_name = this.search_obj.fields.waitingtime_res.nextAvailableQueue.name || '';
      this.sel_loc = this.search_obj.fields.location_id1;
      this.sel_checkindate = this.search_obj.fields.waitingtime_res.nextAvailableQueue.availableDate;
      this.getServicebyLocationId (this.search_obj.fields.location_id1, this.sel_checkindate);
      // const retdatedet = this.getQueueDateTimeDetails(this.search_obj.fields.waitingtime_res.nextAvailableQueue);
     // this.sel_queue_det = retdatedet;
      this.showfuturediv = false;
      this.revealphonenumber = true;
    }

    gets3curl() {
      this.retval = this.sharedFunctionobj.getS3Url()
                  .then(
                    res => {
                      this.s3url = res;
                      this.getbusinessprofiledetails_json('settings', true);
                    },
                    error => { }
                  );
    }

    // gets the various json files based on the value of "section" parameter
    getbusinessprofiledetails_json(section, modDateReq: boolean) {
      let  UTCstring = null ;
      if (modDateReq) {
         UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
      }
      this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
      .subscribe (res => {
          switch (section) {
           /* case 'businessProfile': {
              this.businessjson = res;
            break;
            }
            case 'services': {
              this.servicesjson = res;
            break;
            }
            case 'gallery': {
              this.galleryjson = res;
              if (this.galleryjson) {
                this.mainimage_holder = this.galleryjson[0].url;
              }
            break;
            }*/
            case 'settings': {
              this.settingsjson = res;
              this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
              // this.getbusinessprofiledetails_json('services', true);
            break;
            }
            /*case 'location': {
              this.locationjson = res;
            break;
            }
            case 'menu': {
              this.menujson = res;
            break;
            }
            case 'terminologies': {
              this.terminologiesjson = res;
            break;
            }*/
          }
      },
      error => {

      }
     );
    }

    getServicebyLocationId(locid, pdate) {
      this.shared_services.getServicesByLocationId (locid)
        .subscribe ( data => {
            this.servicesjson = data;
            this.sel_ser_det = [];
            if (this.servicesjson.length > 0) {
              this.sel_ser = this.servicesjson[0].id; // set the first service id to the holding variable
              this.setServiceDetails(this.servicesjson[0]); // setting the details of the first service to the holding variable
              this.getQueuesbyLocationandServiceId(locid, this.sel_ser, pdate, this.account_id);
            }
        });
    }
    setServiceDetails(serv) {
      console.log('serdet', serv);
      this.sel_ser_det = [];
      if (serv.serviceDuration) {
        this.sel_ser_det = {
            name: serv.name,
            duration: serv.serviceDuration,
            description: serv.description,
            price: serv.totalAmount,
            isPrePayment:	serv.isPrePayment,
            minPrePaymentAmount: serv.minPrePaymentAmount,
            status: serv.status,
            taxable: serv.taxable
          };
        }
    }

    getQueuesbyLocationandServiceId(locid, servid, pdate?, accountid?) {
       this.shared_services.getQueuesbyLocationandServiceId(locid, servid, pdate, accountid)
        .subscribe( data => {
          this.queuejson = data;
          if (this.queuejson.length > 0) {
              this.sel_queue_id = this.queuejson[0].id;
              this.sel_queue_waitingmins = this.queuejson[0].queueWaitingTime;
              this.sel_queue_name = this.queuejson[0].name;
          } else {
              this.sel_queue_id = 0;
              this.sel_queue_waitingmins = 0;
              this.sel_queue_name = '';
          }

        });
    }

  handleServiceSel(obj) {
    this.sel_ser = obj.id;
    this.setServiceDetails(obj);
    this.queuejson = [];
    this.sel_queue_id = 0;
    this.sel_queue_waitingmins = 0;
    this.sel_queue_name = '';

    this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
  }

  isSelectedService(id) {
    let clr = false;
    if (id === this.sel_ser) {
      clr = true;
    } else {
      clr = false;
    }
    return clr;
  }

  isSelectedQueue(id) {
    let clr = false;
    if (id === this.sel_queue_id) {
      clr = true;
    } else {
      clr = false;
    }
    return clr;
  }

  handleQueueSel(obj) {
    this.sel_queue_id = obj.id;
    this.sel_queue_waitingmins = obj.queueWaitingTime;
    this.sel_queue_name = obj.name;
  }

  handleFuturetoggle() {
    this.showfuturediv = !this.showfuturediv;
  }

  isCheckinenable() {
    if (this.sel_loc && this.sel_ser && this.sel_queue_id && this.sel_checkindate) {
      return true;
    } else {
      return false;
    }
  }
  revealChk() {
    this.revealphonenumber = !this.revealphonenumber;
  }

  handleConsumerNote(vale) {
    this.consumerNote = vale;
  }
  handleFutureDateChange(e) {
    const obtmonth = (e._i.month + 1);
    let cmonth = '' + obtmonth;
    if ( obtmonth < 10) {
      cmonth = '0' + obtmonth;
    }
    const seldate = e._i.year + '-' + cmonth + '-' + e._i.date;
    console.log('date changed', seldate, e);
    this.sel_checkindate = seldate;
    this.handleFuturetoggle();
    this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
  }
  handleServiceForWhom() {

  }
  handleCheckinClicked() {
    this.resetApiErrors();
    if (this.step === 1) {
      this.step = 2;
    } else if (this.step === 2) {
      this.saveCheckin();
    }
  }
  saveCheckin() {
    const post_Data = {
        'queue': {
          'id': this.sel_queue_id
        },
        'date': this.sel_checkindate,
        'service': {
          'id': this.sel_ser
        },
        'consumerNote': this.consumerNote,
        'waitlistingFor': [
          {
            'id': this.waitlist_for.id
          }
        ],
        'revealPhone': this.revealphonenumber
    };
    this.shared_services.addCheckin(this.account_id, post_Data)
      .subscribe(data => {
        console.log('check-in returned', data);
        this.api_success = 'Check in saved successfully';
        setTimeout(() => {
          this.dialogRef.close('reloadlist');
         }, projectConstants.TIMEOUT_DELAY);
      },
      error => {
         this.api_error = error.error;
      });
  }
  handleGoBack(cstep) {
    this.step = cstep;
  }
  showCheckinButtonCaption() {
    let caption = '';
    if (this.step === 1) {
      caption = 'Check in';
    } else if (this.step === 2) {
      caption = 'Confirm';
    }
    return caption;
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
