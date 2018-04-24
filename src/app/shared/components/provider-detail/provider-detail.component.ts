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

  public provider_id;
  public s3url;
  public retval;
  public retbus_profile;
  public ret_fav;
  public businessjson;
  public servicesjson;
  public settingsjson;
  public locationjson;
  public galleryjson;
  public menujson;
  public terminologiesjson;
  public accountsjson;
  public approx_waitingtime;
  public ret;
  public mainimage_holder;
  public weekdayarr = projectConstants.myweekdaysSchedule;
  public errors;
  public msg_exists;
  public msg_type;
  public isFavourite;
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
    .subscribe(params => this.provider_id = params.get('id'));

    if (this.provider_id) {
      this.gets3curl();
    }
    this.isFavourite = false;
  }

  // get s3url
  gets3curl() {
    this.retval = this.sharedFunctionobj.getS3Url()
                .then(
                  res => {

                    this.s3url = res;
                    this.getbusinessprofiledetails_json('businessProfile', true);
                    this.getbusinessprofiledetails_json('services', true);
                    this.getbusinessprofiledetails_json('settings', true);
                    this.getbusinessprofiledetails_json('location', true);
                    this.getbusinessprofiledetails_json('gallery', true);
                    this.getbusinessprofiledetails_json('menu', true);
                    this.getbusinessprofiledetails_json('terminologies', false);

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
    this.retbus_profile = this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
    .subscribe (res => {
        switch (section) {
          case 'businessProfile': {
            this.businessjson = res;
            this.getapproxWaitingtime(); /* get the appoximate waiting time*/
            if (this.sharedFunctionobj.checkLogin()) {
              this.getaccounts_json();
            }
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
          }
          case 'settings': {
            this.settingsjson = res;
          break;
          }
          case 'location': {
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
          }
        }
    },
    error => {
      this.errors = error;
    }
   );
  }
 /* function to show the clicked the image in the image gallery */
  swap_image(url) {
    this.mainimage_holder = url;
  }
  /* function to generate the week day list of open timings*/
  getScheduledaysstr(days) {
    let strs = '';
    for (let i = 0; i < days.length; i++) {
        const dayval = days[i];
        if (strs !== '') {
          strs = strs + ', ';
        }
        strs = strs + this.weekdayarr[dayval];
    }
    return strs;
  }
  /* function to take user to the search page*/
  gobacktoSearch() {
    // console.log('currentpath', this.locationobj.path);
     this.locationobj.back();
  }
  /* function to add provider to the fav list */
  addtoFavourite() {
    this.retval = this.shared_services.addFavProvider(this.businessjson.id)
    .subscribe(res => {
      this.ret_fav = res;
     // console.log(res);
      this.isFavourite = true;
      this.msg_exists = '';
      this.msg_type = '';
    },
    error => {
      this.msg_exists = error.error;
      this.msg_type = 'e';
    });
  }
 /* function to get the approximate waiting time for current provider*/
  getapproxWaitingtime() {
    this.providerdetailserviceobj.getapproxWaitingtime(this.businessjson.id)
    .subscribe(res => {
      this.approx_waitingtime = res;
      if (this.approx_waitingtime == null) {
        this.approx_waitingtime = 0;
      }
      // console.log('approx' + this.approx_waitingtime);
    });
  }

  /* function to get the list of existing fav providers */
  getaccounts_json() {
    this.shared_services.getFavProvider()
    .subscribe(data => {
      this.accountsjson = data;
      for (const x of this.accountsjson) {
         if (x.id === this.businessjson.id) {
           this.isFavourite = true;
         }

      }

    });
  }

  // handle_checkinClicked(serviceid) {
  //   const dialogRef = this.dialogobj.open(CheckinComponent, {
  //     width: '50%',
  //     data: {
  //       serv_id: serviceid
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }
}

