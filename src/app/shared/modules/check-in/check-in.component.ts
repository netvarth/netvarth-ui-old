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
    servicesjson: any = [];
    galleryjson: any = [];
    settingsjson: any = [];
    locationjson: any = [];
    sel_loc;
    sel_ser;
    sel_que;
    search_obj;
    checkinenable = false;
    checkindisablemsg = '';
    pass_loc;
    constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public sharedFunctionobj: SharedFunctions,
    public router: Router,
    public dialogRef: MatDialogRef<CheckInComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
     console.log(data);
    }

    ngOnInit() {
      this.search_obj = this.data.srchprovider;
      this.provider_id = this.search_obj.fields.unique_id;
      this.gets3curl();
    }
    gets3curl() {
      this.sharedFunctionobj.getS3Url()
                  .then(
                    res => {
                      this.s3url = res;
                      console.log('s3url', this.s3url);
                      this.getbusinessprofiledetails_json('settings', true);
                      this.getbusinessprofiledetails_json('location', true);
                      this.getbusinessprofiledetails_json('services', false);

                      /*this.getbusinessprofiledetails_json('businessProfile', true);

                      this.getbusinessprofiledetails_json('settings', true);
                      this.getbusinessprofiledetails_json('location', true);
                      this.getbusinessprofiledetails_json('gallery', true);
                      this.getbusinessprofiledetails_json('menu', true);
                      this.getbusinessprofiledetails_json('terminologies', false);*/
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
          case 'businessProfile':
            // this.businessjson = res;
            // this.getapproxWaitingtime(); /* get the appoximate waiting time*/
            if (this.sharedFunctionobj.checkLogin()) {
              // this.getaccounts_json();
            }
          break;
          case 'services':
            this.servicesjson = res;
            console.log('services', this.servicesjson);
          break;
          case 'gallery':
            this.galleryjson = res;
            if (this.galleryjson) {
              // this.mainimage_holder = this.galleryjson[0].url;
            }
          break;
          case 'settings':
            this.settingsjson = res;
            console.log('location', this.settingsjson);
            if (this.settingsjson.enabledWaitlist) {
              this.checkinenable = true;
            } else {
              this.checkindisablemsg = 'Check-in not allowed for this provider';
            }

          break;

          case 'location':
            this.locationjson = res;
            console.log('location', this.locationjson);
          break;

         /* case 'menu': {
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
      // this.errors = error;
    }
   );
  }
  handleLocationSel(obj) {
   // console.log('select loc', obj);
    this.sel_loc = obj.id;
  }
  isSelectedLoc(id) {
    let clr = false;
    if (id === this.sel_loc) {
      clr = true;
    } else {
      clr = false;
    }
    return clr;
  }
}
