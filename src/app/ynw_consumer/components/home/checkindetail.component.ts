import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';
import { projectConstants } from '../../../app.component';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { Location } from '@angular/common';
import { ConsumerServices } from '../../services/consumer-services.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { ActionPopupComponent } from './action-popup/action-popup.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { SubSink } from 'subsink';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';


@Component({
  selector: 'app-checkindetail',
  templateUrl: './checkindetail.component.html',
  styleUrls: ['./consumer-home.component.css']
})
export class CheckinDetailComponent implements OnInit,OnDestroy {

  private subs=new SubSink();
  elementType = 'url';
  waitlist: any;
  api_loading = true;
  go_back_cap = Messages.CHECK_DET_GO_BACK_CAP;
  bname_cap = Messages.CHK_DET_BNAME;
  date_cap = Messages.CHECK_DET_DATE_CAP;
  location_cap = Messages.CHECK_DET_LOCATION_CAP;
  waitlist_for_cap = Messages.CHECK_DET_WAITLIST_FOR_CAP;
  service_cap = Messages.CHECK_DET_SERVICE_CAP;
  queue_cap = Messages.CHECK_DET_QUEUE_CAP;
  pay_status_cap = Messages.CHECK_DET_PAY_STATUS_CAP;
  not_paid_cap = Messages.CHECK_DET_NOT_PAID_CAP;
  partially_paid_cap = Messages.CHECK_DET_PARTIALLY_PAID_CAP;
  paid_cap = Messages.CHECK_DET_PAID_CAP;
  add_pvt_note_cap = Messages.CHECK_DET_ADD_PRVT_NOTE_CAP;
  send_msg_cap = Messages.CHECK_DET_SEND_MSG_CAP;
  comm_history_cap = Messages.COMMU_HISTORY_CAP;
  checkin_label = '';
  details_cap = Messages.CHECK_DET_DETAILS_CAP;
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  check_in_statuses = projectConstantsLocal.CHECK_IN_STATUSES;
  dateTimeFormat = projectConstants.PIPE_DISPLAY_DATE_TIME_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP;
  addnotedialogRef: any;
  customer_label: any;
  no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP;
  consumerNote: any;
  ynwUuid: any;
  communication_history: any = [];
  providerId: any;
  titlename = 'Check-in Details';
  showtoken: any;
  provider_label;
  iconClass: string;
  view_more = false;
  path = projectConstants.PATH;
  qr_value: string;
  actiondialogRef: any;
  fav_providers: any;
  fav_providers_id_list: any[];
  wthistory;
  constructor(
    private activated_route: ActivatedRoute,
    private dialog: MatDialog,
    public locationobj: Location,
    public shared_functions: SharedFunctions,
    private router: Router,
    @Inject(DOCUMENT) public document,
    private consumer_services: ConsumerServices,
    private sharedServices: SharedServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private dateTimeProcessor: DateTimeProcessor
  ) {
    this.subs.sink=this.activated_route.queryParams.subscribe(
      (qParams) => {
        this.ynwUuid = qParams.uuid;
        this.providerId = qParams.providerId;
      });
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP.replace('[customer]', this.customer_label);
    this.checkin_label = this.wordProcessor.getTerminologyTerm('checkin');
    this.no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP.replace('[customer]', this.customer_label);
    // this.phonenumber = waitlistjson.waitlistPhoneNumber;
  }
  ngOnInit() {
    this.getCommunicationHistory();
   this.subs.sink= this.sharedServices.getCheckinByConsumerUUID(this.ynwUuid, this.providerId).subscribe(
      (data) => {
        this.waitlist = data;
        this.generateQR();
        this.getWtlistHistory(this.waitlist.ynwUuid, this.waitlist.providerAccount.id);
        if (this.waitlist.service.serviceType === 'virtualService') {
          switch (this.waitlist.service.virtualCallingModes[0].callingMode) {
            case 'Zoom': {
              this.iconClass = 'fa zoom-icon';
              break;
            }
            case 'GoogleMeet': {
              this.iconClass = 'fa meet-icon';
              break;
            }
            case 'WhatsApp': {
              if (this.waitlist.service.virtualServiceType === 'audioService') {
                this.iconClass = 'fa wtsapaud-icon';
              } else {
                this.iconClass = 'fa wtsapvid-icon';
              }
              break;
            }
            case 'Phone': {
              this.iconClass = 'fa phon-icon';
              break;
            }
          }
        }
        this.showtoken = this.waitlist.showToken;
        if (this.showtoken) {
          this.titlename = 'Token Details';
        }
      },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    this.getFavouriteProvider();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  generateQR() {
    this.qr_value = this.path + 'status/' + this.waitlist.checkinEncId;
  }
  gotoPrev() {
    this.locationobj.back();
  }
  addCommonMessage(event) {
    event.stopPropagation();
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['uuid'] = this.ynwUuid;
    pass_ob['user_id'] = this.providerId;
    pass_ob['name'] = this.waitlist.providerAccount.businessName;
    pass_ob['typeOfMsg'] = 'single';
    this.addNote(pass_ob);
  }
  addNote(pass_ob) {
    this.addnotedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob
    });
    this.addnotedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
  getCommunicationHistory() {
    this.subs.sink=this.consumer_services.getConsumerCommunications(this.providerId)
      .subscribe(
        data => {
          const history: any = data;
          this.communication_history = [];
          for (const his of history) {
            if (his.waitlistId === this.ynwUuid) {
              this.communication_history.push(his);
            }
          }
          this.sortMessages();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
  providerDetail(provider) {
    this.router.navigate(['searchdetail', provider.uniqueId]);
  }
  viewMore() {
    this.view_more = !this.view_more;
  }

  gotoActions(booking) {
    this.actiondialogRef = this.dialog.open(ActionPopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: { booking }
    });
    this.actiondialogRef.afterClosed().subscribe(data => {
    });
  }

  getFavouriteProvider() {
    this.subs.sink=this.sharedServices.getFavProvider()
      .subscribe(
        data => {
          this.fav_providers = data;
          this.fav_providers_id_list = [];
          this.setWaitlistTimeDetails();
        },
        error => {
        }
      );
  }

  setWaitlistTimeDetails() {
    // let k = 0;
    for (const x of this.fav_providers) {
      this.fav_providers_id_list.push(x.id);
      // k++;
    }
  }

  checkIfFav(id) {
    let fav = false;
    this.fav_providers_id_list.map((e) => {
      if (e === id) {
        fav = true;
      }
    });
    return fav;
  }

  doDeleteFavProvider(fav, event) {
    event.stopPropagation();
    if (!fav.id) {
      return false;
    }
    this.shared_functions.doDeleteFavProvider(fav, this)
      .then(
        data => {
          if (data === 'reloadlist') {
            this.getFavouriteProvider();
          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }

  addFavProvider(id, event) {
    event.stopPropagation();
    if (!id) {
      return false;
    }
    this.subs.sink=this.sharedServices.addProvidertoFavourite(id)
      .subscribe(
        data => {
          this.getFavouriteProvider();
        },
        error => {
        }
      );
  }

  getWtlistHistory(uuid, accid) {
    this.subs.sink=this.consumer_services.getWtlistHistory(uuid, accid)
      .subscribe(
        data => {
          this.wthistory = data;
          console.log(this.wthistory);
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getTimeToDisplay(min) {
    return this.dateTimeProcessor.convertMinutesToHourMinute(min);
  }
}
