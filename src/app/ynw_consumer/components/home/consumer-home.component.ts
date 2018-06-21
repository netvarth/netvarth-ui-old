import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ConsumerServices } from '../../services/consumer-services.service';
import { ConsumerDataStorageService } from '../../services/consumer-datastorage.service';
import { SharedServices } from '../../../shared/services/shared-services';

import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { NotificationListBoxComponent } from '../../shared/component/notification-list-box/notification-list-box.component';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { AddConsumerWaitlistCheckInProviderNoteComponent } from '../add-consumer-waitlist-checkin-provider-note/add-consumer-waitlist-checkin-provider-note.component';

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
  loadcomplete = {waitlist: false , fav_provider: false};

  public searchfields: SearchFields = new SearchFields();

  constructor(private consumer_services: ConsumerServices,
    private shared_services: SharedServices,
    private dialog: MatDialog, private router: Router,
  private consumer_datastorage: ConsumerDataStorageService) {}

  ngOnInit() {

    this.getWaitlist();
    this.getHistroy();
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
      const date = moment().format(projectConstants.POST_DATE_FORMAT);
      const params = {
      'date-le': date
      };
      this.consumer_services.getWaitlistHistory(params)
      .subscribe(
      data => {
          this.history = data;
      },
      error => {

      }
      );
  }

  getHistoryCount() {
    const date = moment().format(projectConstants.POST_DATE_FORMAT);
    const params = {
    'date-le': date,
    'waitlistStatus-neq': 'waitlisted,arrived'
    };
    this.consumer_services.getWaitlistCount(params)
    .subscribe(
    data => {
      const count: any = data;
      if (count > 0) {
          this.getHistroy();
      }
    },
    error => {

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

}

