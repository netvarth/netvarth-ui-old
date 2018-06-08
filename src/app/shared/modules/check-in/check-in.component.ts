import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

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
    familymembers: any = [];
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
    waitlist_for: any = [];
    holdwaitlist_for: any = [];
    paymentModes: any = [];
    loggedinuser;
    maxsize;
    paytype = '';
    isFuturedate = false;
    addmemberobj = {'fname': '', 'lname': '', 'mobile': ''};
    payment_popup = null;
    constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public sharedFunctionobj: SharedFunctions,
    public router: Router,
    public dialogRef: MatDialogRef<CheckInComponent>,
    public _sanitizer: DomSanitizer,
    @Inject(DOCUMENT) public document,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
      console.log('check-inpassed data', data);
    }

    ngOnInit() {
      this.maxsize = 1;
      this.step = 1;
      this.loggedinuser = this.sharedFunctionobj.getitemfromLocalStorage('ynw-user');
      this.gets3curl();
      this.getFamilyMembers();
      this.consumerNote = '';
      this.today = new Date();
      this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

      const dd = this.today.getDate();
      const mm = this.today.getMonth() + 1; // January is 0!
      const yyyy = this.today.getFullYear();
      let cday = '';
      if (dd < 10) {
          cday = '0' + dd;
      } else {
        cday = '' + dd;
      }
      let cmon;
      if (mm < 10) {
        cmon = '0' + mm;
      } else {
        cmon = '' + mm;
      }
      const dtoday = yyyy + '-' + cmon + '-' + cday;

      this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
      this.waitlist_for.push ({id: this.loggedinuser.id, name: 'Self'});

      if (this.data.moreparams.source === 'searchlist_checkin') { // case check-in from search result page

        this.search_obj = this.data.srchprovider;
        this.provider_id = this.search_obj.fields.unique_id;
        const providarr = this.search_obj.id.split('-');
        this.account_id = providarr[0];
        this.sel_queue_id = this.search_obj.fields.waitingtime_res.nextAvailableQueue.id;
        // this.sel_queue_name = this.search_obj.fields.waitingtime_res.nextAvailableQueue.name || '';
        this.sel_loc = this.search_obj.fields.location_id1;
        this.sel_checkindate = this.search_obj.fields.waitingtime_res.nextAvailableQueue.availableDate;

      } else if (this.data.moreparams.source === 'provdet_checkin') { // case check-in from provider details page

        // this.search_obj = this.data.srchprovider;
        this.provider_id = this.data.moreparams.provider.unique_id;
        this.account_id = this.data.moreparams.provider.account_id;

        const srch_fields = {
                              fields: {
                                title: this.data.moreparams.provider.name,
                                place1: this.data.moreparams.location.name,
                              }
        };
        this.search_obj = srch_fields;

        // this.sel_queue_id = this.search_obj.fields.waitingtime_res.nextAvailableQueue.id;
        this.sel_loc = this.data.moreparams.location.id;
        this.sel_checkindate = this.data.moreparams.sel_date;

      }
      this.getServicebyLocationId (this.sel_loc, this.sel_checkindate);
      this.getPaymentModesofProvider(this.account_id);
      // console.log('selcheckindate', this.sel_checkindate);
      if (this.sel_checkindate !== dtoday) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
        this.isFuturedate = true;
      }
      // const retdatedet = this.getQueueDateTimeDetails(this.search_obj.fields.waitingtime_res.nextAvailableQueue);
     // this.sel_queue_det = retdatedet;
      this.showfuturediv = false;
      this.revealphonenumber = true;
    }
    getPaymentModesofProvider(provid) {
      this.shared_services.getPaymentModesofProvider(provid)
        .subscribe (data => {
          this.paymentModes = data;
          console.log ('paymodes', this.paymentModes);
        },
      error => {
        console.log ('error', error);
      });
    }
    getFamilyMembers() {
      this.shared_services.getConsumerFamilyMembers()
        .subscribe( data => {
          this.familymembers = data;
         // console.log('family', this.familymembers);
        },
        error => {
        });
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
            case 'settings': {
              this.settingsjson = res;
              this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
              this.maxsize = this.settingsjson.maxPartySize;
              if (this.maxsize === undefined) {
                this.maxsize = 1;
              }
            break;
            }
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
     // console.log('serdet', serv);
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
    // console.log('date changed', seldate, e);
    this.sel_checkindate = seldate;
    this.handleFuturetoggle();
    this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
  }
  handleServiceForWhom() {
    this.holdwaitlist_for = this.waitlist_for;
    this.step = 3;
  }
  handleCheckinClicked() {
    this.resetApi();
    let error = '';
    if (this.step === 1) {
      this.step = 2;
    } else if (this.step === 2) {
      if (this.sel_ser_det.isPrePayment) {
        console.log('serv det', this.sel_ser_det);
        if (this.paytype === '') {
          error = 'Please select the payment mode';
        }
      }
      if (error === '') {
        this.saveCheckin();
      } else {
        this.api_error = error;
      }
    }
  }
  saveCheckin() {
    const waitlistarr = [];
    for (let i = 0; i < this.waitlist_for.length; i++) {
      waitlistarr.push({id: this.waitlist_for[i].id});
    }
    const post_Data = {
        'queue': {
          'id': this.sel_queue_id
        },
        'date': this.sel_checkindate,
        'service': {
          'id': this.sel_ser
        },
        'consumerNote': this.consumerNote,
        'waitlistingFor': JSON.parse(JSON.stringify(waitlistarr)),
        'revealPhone': this.revealphonenumber
    };
    console.log('postdata', JSON.stringify(post_Data));
    this.shared_services.addCheckin(this.account_id, post_Data)
      .subscribe(data => {
        const retData = data;
        console.log('check-in returned', retData);
        let toKen;
        let retUUID;
        Object.keys(retData).forEach(key => {
          toKen = key;
          retUUID =  retData[key];
        });
        console.log('token', toKen);
        console.log('uuid', retUUID);
        if (this.sel_ser_det.isPrePayment) { // case if prepayment is to be done
          if (this.paytype !== '' && retUUID && this.sel_ser_det.isPrePayment && this.sel_ser_det.minPrePaymentAmount > 0) {
            const payData = {
              'amount': this.sel_ser_det.minPrePaymentAmount,
              'paymentMode': this.paytype,
              'uuid': retUUID
            };
            this.shared_services.consumerPayment(payData)
              .subscribe (pData => {
                  if (pData['response']) {
                    this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(pData['response']);
                    this.api_success = Messages.CHECKIN_SUCC_REDIRECT;
                      setTimeout(() => {
                        this.document.getElementById('payuform').submit();
                      }, 2000);
                  } else {
                    this.api_error = Messages.CHECKIN_ERROR;
                  }
              },
              error => {
                this.api_error = error.error;
              });
          } else {
            this.api_error = Messages.CHECKIN_ERROR;
          }
        } else {
          this.api_success = Messages.CHECKIN_SUCC;
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        }
      },
      error => {
         this.api_error = error.error;
      });
  }
  handleGoBack(cstep) {
    this.resetApi();
    this.step = cstep;
    if (this.waitlist_for.length === 0) { // if there is no members selected, then default to self
      this.waitlist_for.push ({id: this.loggedinuser.id, name: 'Self'});
    }
  }
  showCheckinButtonCaption() {
    let caption = '';
    if (this.step === 1) {
      caption = 'Proceed to Check-in';
    } else if (this.step === 2) {
      caption = 'Confirm Check-in';
    }
    return caption;
  }

  handleMemberSelect(id, name, obj) {
    this.resetApi();
   // console.log('mem select', obj);
   // console.log('changed');
    if (this.waitlist_for.length === 0) {
      this.waitlist_for.push({ id: id, name: name });
    } else {
      let exists = false;
      let existindx = -1;
      for (let i = 0; i < this.waitlist_for.length; i++) {
        if (this.waitlist_for[i].id === id) {
          exists = true;
          existindx = i;
        }
      }
      if (exists) {
        this.waitlist_for.splice(existindx, 1);
      } else {
        if (this.ismoreMembersAllowedtopush()) {
          this.waitlist_for.push({ id: id, name: name });
        } else {
          obj.source.checked = false; // preventing the current checkbox from being checked
          if  (this.maxsize > 1) {
            this.api_error = 'Only ' + this.maxsize + ' member(s) can be selected';
          } else if (this.maxsize === 1) {
            this.api_error = 'Only ' + this.maxsize + ' member can be selected';
          }
        }
      }
    }
    // console.log('selected members', this.waitlist_for);
  }
 ismoreMembersAllowedtopush() {
    if (this.maxsize > this.waitlist_for.length) {
      return true;
    } else {
      return false;
    }
  }
  isChecked(id) {
    let retval = false;

    if (this.waitlist_for.length > 0) {
      for (let i = 0; i < this.waitlist_for.length; i++) {
        if (this.waitlist_for[i].id === id) {
         // console.log('ischecked');
          retval = true;
        }
      }
    }
    return retval;
  }

  addMember() {
    this.resetApi();
    this.step = 4; // show add member section
  }

  resetApi() {
    this.api_error = null;
    this.api_success = null;
  }

  handleReturnDetails(obj) {
    this.resetApi();
    this.addmemberobj.fname = obj.fname || '';
    this.addmemberobj.lname = obj.lname || '';
    this.addmemberobj.mobile = obj.mobile || '';
    console.log('add member return', this.addmemberobj);
  }
  handleSaveMember() {
    this.resetApi();
    let derror = '';
    const namepattern =   new RegExp(projectConstants.VALIDATOR_CHARONLY);
    const phonepattern =   new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
    const phonecntpattern =   new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);

    if (!namepattern.test(this.addmemberobj.fname)) {
      derror = 'Please enter a valid first name';
    }

    if (derror === '' && !namepattern.test(this.addmemberobj.lname)) {
      derror = 'Please enter a valid last name';
    }

    if (derror === '') {
      if (!phonepattern.test(this.addmemberobj.mobile)) {
        derror = 'Phone number should have only numbers';
      } else if (!phonecntpattern.test(this.addmemberobj.mobile)) {
        derror = 'Phone number should have 10 digits';
      }
    }

    if (derror === '') {
      const post_data = {
        'userProfile': {
                          'firstName': this.addmemberobj.fname,
                          'lastName':  this.addmemberobj.lname,
                          'primaryMobileNo': this.addmemberobj.mobile,
                          'countryCode': '+91',
                        }
        };

        this.shared_services.addMembers(post_data)
        .subscribe(data => {
            this.api_success = Messages.MEMBER_CREATED;
            this.getFamilyMembers();
            setTimeout(() => {
              this.handleGoBack(3);
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.api_error = error.error;
          } );

    } else {
       this.api_error = derror;
    }
  }
}
