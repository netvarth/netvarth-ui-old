import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConsumerServices } from '../../services/consumer-services.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { projectConstants } from '../../../app.component';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-consumer-waitlist',
  templateUrl: './waitlist.component.html'
})
export class WaitlistComponent implements OnInit, OnDestroy {

  waitlist_detail;
  provider_id = null;
  waitlist_id = null;
  communication_history: any = [];

  checkin_details_cap = Messages.CHECKIN_DET_CAP;
  bussiness_name_cap = Messages.BUSS_NAME_CAP;
  date_cap = Messages.DATE_CAP;
  location_cap = Messages.LOCATION_CAP;
  wait_for_cap = Messages.WAITLIST_FOR_CAP;
  service_cap = Messages.SERVICE_CAP;
  serv_time_window_cap = Messages.SER_TIME_WINDOW_CAP;
  payment_status = Messages.PAY_STATUS_CAP;
  not_paid_cap = Messages.NOT_PAID_CAP;
  partialy_paid_cap = Messages.PARTIALLY_PAID_CAP;
  paid_cap = Messages.PAID_CAP;
  send_msg_cap = Messages.SEND_MSG_CAP;
  add_to_fav_cap = Messages.ADD_TO_FAV;
  remove_fav_cap = Messages.REMOVE_FAV;
  cancel_checkin_cap = Messages.CANCEL_CHECKIN;
  comm_history_cap = Messages.COMMU_HISTORY_CAP;


  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;

  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  canceldialogRef;
  remfavdialogRef;

  public searchfields: SearchFields = new SearchFields();

  constructor(private consumer_services: ConsumerServices,
    private shared_functions: SharedFunctions,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private shared_services: SharedServices) { }

  ngOnInit() {
    this.route.params
      .subscribe((data) => {
        this.provider_id = data.provider_id;
        this.waitlist_id = data.uuid;
        if (this.provider_id && this.waitlist_id) {
          this.getWaitlist();
        } else {
          this.router.navigate(['/consumer']);
        }
      });

  }
  ngOnDestroy() {
    if (this.canceldialogRef) {
      this.canceldialogRef.close();
    }
    if (this.remfavdialogRef) {
      this.remfavdialogRef.close();
    }
  }

  getWaitlist() {
    const params = {
      account: this.provider_id
    };
    this.consumer_services.getWaitlistDetail(this.waitlist_id, params)
      .subscribe(
        data => {
          this.waitlist_detail = data;
          const waitlist_date = new Date(this.waitlist_detail.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          waitlist_date.setHours(0, 0, 0, 0);

          this.waitlist_detail.history = false;

          if (today.valueOf() > waitlist_date.valueOf()) {
            this.waitlist_detail.history = true;
          }
          this.getCommunicationHistory();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  addWaitlistMessage(waitlist) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['uuid'] = waitlist.ynwUuid;
    pass_ob['user_id'] = waitlist.providerAccount.id;
    pass_ob['name'] = waitlist.providerAccount.businessName;
    this.addNote(pass_ob);

  }

  addNote(pass_ob) {

    const dialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }

  doCancelWaitlist(waitlist) {
    if (!waitlist.ynwUuid || !waitlist.providerAccount.id) {
      return false;
    }

    this.shared_functions.doCancelWaitlist(waitlist, this)
      .then(
        data => {
          if (data === 'reloadlist') {
            this.getWaitlist();
          }
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  doDeleteFavProvider(fav) {

    if (!fav.id) {
      return false;
    }

    this.shared_functions.doDeleteFavProvider(fav, this)
      .then(
        data => {
          if (data === 'reloadlist') {

          }
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }

  addFavProvider(id) {
    if (!id) {
      return false;
    }

    this.shared_services.addProvidertoFavourite(id)
      .subscribe(
        () => {

        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }


  getCommunicationHistory() {
    this.consumer_services.getConsumerCommunications(this.waitlist_detail.providerAccount.id)
      .subscribe(
        data => {
          const history: any = data;
          this.communication_history = [];

          for (const his of history) {
            if (his.waitlistId === this.waitlist_detail.ynwUuid) {
              this.communication_history.push(his);
            }
          }
          this.sortMessages();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  sortMessages() {
    this.communication_history.sort(function (message1, message2) {
      if (message1.timeStamp < message2.timeStamp) {
        return 11;
      } else if (message1.timeStamp > message2.timeStamp) {
        return -1;
      } else {
        return 0;
      }
    });

  }

}
