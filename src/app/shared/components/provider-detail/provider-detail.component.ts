import { Component, OnInit, Input } from '@angular/core';

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

import { Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';

import { SearchFields } from '../../modules/search/searchfields';
import { projectConstants } from '../../../shared/constants/project-constants';
import { ProviderDetailService } from '../provider-detail/provider-detail.service';
// import { CheckinComponent } from '../checkin/checkin.component';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.css']
})
export class ProviderDetailComponent implements OnInit {

  s3url;
  retval;
  kwdet: any = [];
  provider_id;
  settingsjson: any = [];
  businessjson: any = [];
  servicesjson: any = [];
  galleryjson: any = [];
  locationjson: any = [];
  terminologiesjson: any = [];
  futuredate_allowed = false;
  maxsize = 0;
  viewallServices = false;
  showmoreDesc = false;
  bNameStart = '';
  bNameEnd = '';
  constructor(
    private routeobj: ActivatedRoute,
    private providerdetailserviceobj: ProviderDetailService,
    public sharedFunctionobj: SharedFunctions,
    private locationobj: Location,
    private shared_services: SharedServices,
    private dialogobj: MatDialog
  ) {}

  ngOnInit() {
    this.routeobj.paramMap
    .subscribe(params => {
      this.provider_id = params.get('id');
      this.gets3curl();
    });
  }
  backtoSearchResult() {
    this.locationobj.back();
  }
  gets3curl() {
    this.retval = this.sharedFunctionobj.getS3Url('provider')
                .then(
                  res => {
                    this.s3url = res;
                    console.log('s3', this.s3url);
                    this.getbusinessprofiledetails_json('businessProfile', true);
                    this.getbusinessprofiledetails_json('services', true);
                    this.getbusinessprofiledetails_json('gallery', true);
                    this.getbusinessprofiledetails_json('settings', true);
                    this.getbusinessprofiledetails_json('location', true);
                    // this.getbusinessprofiledetails_json('terminologies', true);
                  },
                  error => {
                    this.sharedFunctionobj.apiErrorAutoHide(this, error);
                  }
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
         case 'businessProfile': {
            this.businessjson = res;
            const holdbName = this.businessjson.businessDesc;
            const maxCnt = 20;
            if (holdbName.length > maxCnt ) {
              this.bNameStart = holdbName.substr(0, maxCnt);
              this.bNameEnd = holdbName.substr(maxCnt , holdbName.length);
            } else {
              this.bNameStart = holdbName;
            }
          break;
          }
          case 'services': {
            this.servicesjson = res;
          break;
          }
          case 'gallery': {
            this.galleryjson = res;
            /*if (this.galleryjson) {
              this.mainimage_holder = this.galleryjson[0].url;
            }*/
          break;
          }
          case 'settings': {
            this.settingsjson = res;
            this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
            this.maxsize = this.settingsjson.maxPartySize;
            if (this.maxsize === undefined) {
              this.maxsize = 1;
            }
            // this.getbusinessprofiledetails_json('services', true);
          break;
          }
          case 'location': {
            this.locationjson = res;
          break;
          }
          /* case 'menu': {
            this.menujson = res;
          break;
          }*/
          case 'terminologies': {
            this.terminologiesjson = res;
          break;
          }
        }
    },
    error => {

    }
  );
  }

  showallServices() {
    if (this.viewallServices) {
      this.viewallServices = false;
    } else {
      this.viewallServices = true;
    }
  }
  showDesc() {
    if (this.showmoreDesc) {
      this.showmoreDesc = false;
    } else {
      this.showmoreDesc = true;
    }
  }
}

