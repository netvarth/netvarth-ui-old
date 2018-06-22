import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ConsumerServices } from '../../services/consumer-services.service';
import { ConsumerDataStorageService } from '../../services/consumer-datastorage.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { NotificationListBoxComponent } from '../../shared/component/notification-list-box/notification-list-box.component';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { AddConsumerWaitlistCheckInProviderNoteComponent } from '../add-consumer-waitlist-checkin-provider-note/add-consumer-waitlist-checkin-provider-note.component';
import { CheckInComponent } from '../../../shared/modules/check-in/check-in.component';
import { ViewConsumerWaitlistCheckInBillComponent } from '../consumer-waitlist-view-bill/consumer-waitlist-view-bill.component';

import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-consumer-home',
  templateUrl: './consumer-home.component.html',
  styleUrls: ['./consumer-home.component.scss']
})
export class ConsumerHomeComponent implements OnInit {

  waitlists;
  fav_providers: any = [];
  history ;
  fav_providers_id_list = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  loadcomplete = {waitlist: false , fav_provider: false, history: false};

  pagination: any  = {
    startpageval: 1,
    totalCnt : 0,
    perPage : projectConstants.PERPAGING_LIMIT
  };

  public searchfields: SearchFields = new SearchFields();

  constructor(private consumer_services: ConsumerServices,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog, private router: Router,
  private consumer_datastorage: ConsumerDataStorageService) {}

  ngOnInit() {

    this.getWaitlist();
    this.getHistoryCount();
    this.getFavouriteProvider();

  }
  getWaitlist() {

      this.loadcomplete.waitlist = false;

       const params = {
     //  'sort_id': 'asc',
     // 'waitlistStatus-eq': 'checkedIn,arrived'
      };

      this.consumer_services.getWaitlist(params)
      .subscribe(
      data => {
        this.waitlists = data;
        this.loadcomplete.waitlist = true;
      },
      error => {
        this.loadcomplete.waitlist = true;
      }
      );
  }

  getHistroy() {
      this.loadcomplete.history = false;
      const params = this.setPaginationFilter();
      this.consumer_services.getWaitlistHistory(params)
      .subscribe(
      data => {
          this.history = data;
          this.loadcomplete.history = true;
      },
      error => {
        this.loadcomplete.history = true;
      }
      );
  }

  getHistoryCount() {
    const date = moment().format(projectConstants.POST_DATE_FORMAT);
    this.consumer_services.getHistoryWaitlistCount()
    .subscribe(
    data => {
      const count: any = data;
      this.pagination.totalCnt = data;
      if (count > 0) {
          this.getHistroy();
      } else {
        this.loadcomplete.waitlist = true;
      }
    },
    error => {
      this.loadcomplete.waitlist = true;
    }
    );
  }

  getFavouriteProvider() {

    this.loadcomplete.fav_provider = false;

    this.shared_services.getFavProvider()
    .subscribe(
    data => {

      this.loadcomplete.fav_provider = true;

      this.fav_providers = data;
      this.fav_providers_id_list = [];

      for (const x of this.fav_providers) {
         this.fav_providers_id_list.push(x.id);
      }

    },
    error => {
      this.loadcomplete.fav_provider = true;
    }
    );
  }

  doCancelWaitlist(waitlist) {

    if (!waitlist.id || !waitlist.provider_id) {
      return false;
    }

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      data: {
        'message' : 'Do you want to remove ' + '' + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.cancelWaitlist(waitlist.id , waitlist.provider_id);
      }

    });

  }

  cancelWaitlist(id , provider_id) {
    const params = {
      'account': provider_id
    };
    this.consumer_services.deleteWaitlist(id, params)
    .subscribe(
    data => {
        console.log(data);
        this.getWaitlist();
    },
    error => {

    }
    );
  }

  doDeleteFavProvider(fav) {

    if (!fav.id) {
      return false;
    }

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
      data: {
        'message' : 'Do you want to remove " ' + fav.businessName + ' " from favourite list?',
        'heading' : 'Confirm'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.deleteFavProvider(fav.id);
      }

    });
  }

  deleteFavProvider(id) {
    this.consumer_services.deleteFavProvider(id)
    .subscribe(
    data => {
        console.log(data);
        this.getFavouriteProvider();
    },
    error => {

    }
    );
  }

  addFavProvider(id) {
    if (!id) {
      return false;
    }

    this.shared_services.addProvidertoFavourite(id)
    .subscribe(
    data => {
        this.getFavouriteProvider();
    },
    error => {

    }
    );
  }

  getAppxTime(time) {
      if (time === 0) {
        return 'Now';
      } else {
        return moment().add(time, 'minutes').format('hh:mm A') + ' Minutes';
      }
  }

  goWaitlistDetail(waitlist) {
    this.consumer_datastorage.set(waitlist);
    this.router.navigate(['consumer/waitlist']);
  }

  openNotification(data) {
    if (!data) {
      return false;
    }

    const dialogRef = this.dialog.open(NotificationListBoxComponent, {
      width: '50%',
      data: {
        'messages' : data
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  checkIfFav(id) {
    let fav = false;

    this.fav_providers_id_list.map((e) => {
      if ( e === id) {
        fav =  true;
      }
    });
    return fav;
  }

  addWaitlistMessage(waitlist) {console.log(waitlist);
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['checkin_id'] = waitlist.ynwUuid;
    pass_ob['user_id'] = waitlist.provider.id;
    this.addNote(pass_ob);

  }

  addCommonMessage(provider) {console.log(provider);
    const pass_ob = {};
    pass_ob['source'] = 'consumer-common';
    pass_ob['user_id'] = provider.id;
    this.addNote(pass_ob);
  }

  addNote(pass_ob) {

    const dialogRef = this.dialog.open(AddConsumerWaitlistCheckInProviderNoteComponent, {
      width: '50%',
      panelClass: 'commonpopupmainclass',
      autoFocus: true,
      data: pass_ob
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }

  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.getHistroy();
  }

  setPaginationFilter() {
    const api_filter = {};
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0;
    api_filter['count'] = this.pagination.perPage;

    return api_filter;
  }

  showCheckin(data, origin = 'consumer') {
    console.log(data);
    const  cdate = new Date();
    const  mn = cdate.getMonth() + 1;
    const  dy = cdate.getDate();
    let mon = '';
    let day = '';
    if (mn < 10) {
      mon = '0' + mn;
    } else {
      mon = '' + mn;
    }
    if (dy < 10) {
      day = '0' + dy;
    } else {
      day = '' + dy;
    }
    const curdate = cdate.getFullYear() + '-' + mon + '-' + day;

    let provider_data = {};
    let location_data = {};

    if (data.provider) {

      provider_data = {
        'unique_id': data.provider.uniqueId,
        'account_id': data.provider.id,
        'name': data.provider.businessName
      };
    } else {
      return false;
    }

    if (data.queue && data.queue.location) {
      location_data = {
        id: data.queue.location.id,
        name: data.queue.location.place
      };
    } else {
      return false;
    }

    const dialogRef = this.dialog.open(CheckInComponent, {
       width: '50%',
       panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      data: {
        type : origin,
        is_provider : false,
        moreparams: { source: 'provdet_checkin',
                      bypassDefaultredirection: 1,
                      provider: provider_data,
                      location: location_data,
                      sel_date: curdate
                    },
        datechangereq: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  getWaitlistBill(waitlist) {

    this.consumer_services.getWaitlistBill(waitlist.ynwUuid)
    .subscribe(
      data => {
        const bill_data = data;
        this.viewBill(waitlist, bill_data);
      },
      error => {
        this.shared_functions.openSnackBar(error.error,  {'panelClass': 'snackbarerror'});
      }
    );
  }

  viewBill(checkin, bill_data) {
    const dialogRef = this.dialog.open(ViewConsumerWaitlistCheckInBillComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'width-100'],
      disableClose: true,
      data: {
        checkin: checkin,
        bill_data: bill_data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }


}

