import { Component, Inject, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-appointmentdetail',
    templateUrl: './appointmentdetail.component.html'
})
export class ApptDetailComponent implements OnInit {
    elementType = 'url';
    api_loading = true;
    go_back_cap = Messages.CHECK_DET_GO_BACK_CAP;
    bname_cap = 'Service Provider';
    date_cap = Messages.CHECK_DET_DATE_CAP;
    location_cap = Messages.CHECK_DET_LOCATION_CAP;
    waitlist_for_cap = 'Appointment for';
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
    dateTimeFormat = projectConstants.PIPE_DISPLAY_DATE_TIME_FORMAT;
    cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP;
    providerId: any;
    addnotedialogRef: any;
    customer_label: any;
    no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP;
    ynwUuid: any;
    communication_history: any = [];
    appt;
    provider_label: any;
    qr_value: string;
    path = projectConstants.PATH;
    iconClass: string;
    view_more = false;
    actiondialogRef;
    fav_providers;
    fav_providers_id_list: any[];
  apptHistory: ArrayBuffer;
    constructor(
        private activated_route: ActivatedRoute,
        private dialog: MatDialog,
        public locationobj: Location,
        private router: Router,
        public shared_functions: SharedFunctions,
        @Inject(DOCUMENT) public document,
        private consumer_services: ConsumerServices,
        private sharedServices: SharedServices
    ) {
        this.activated_route.queryParams.subscribe(
            (qParams) => {
                this.ynwUuid = qParams.uuid;
                this.providerId = qParams.providerId;
            });
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        this.provider_label = this.shared_functions.getTerminologyTerm('provider');
        this.cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP.replace('[customer]', this.customer_label);
        this.checkin_label = this.shared_functions.getTerminologyTerm('checkin');
        this.no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP.replace('[customer]', this.customer_label);
    }
    ngOnInit() {
        this.sharedServices.getAppointmentByConsumerUUID(this.ynwUuid, this.providerId).subscribe(
            (data) => {
                this.appt = data;
                this.generateQR();
                this.getAppointmentHistory(this.appt.uid, this.appt.providerAccount.id);
                if (this.appt.service.serviceType === 'virtualService') {
                    switch (this.appt.service.virtualCallingModes[0].callingMode) {
                        case 'Zoom': {
                          this.iconClass = 'fa zoom-icon';
                          break;
                        }
                        case 'GoogleMeet': {
                          this.iconClass = 'fa meet-icon';
                          break;
                        }
                        case 'WhatsApp': {
                          if (this.appt.service.virtualServiceType === 'audioService') {
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
            },
            (error) => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
        this.getFavouriteProvider();
    }
    generateQR() {
        this.qr_value = this.path + 'status/' + this.appt.appointmentEncId;
    }
    gotoPrev() {
        this.locationobj.back();
    }
    addCommonMessage(appt, event) {
        event.stopPropagation();
        const pass_ob = {};
        pass_ob['source'] = 'consumer-waitlist';
        pass_ob['uuid'] = this.ynwUuid;
        pass_ob['user_id'] = this.providerId;
        pass_ob['name'] = appt.providerAccount.businessName;
        pass_ob['appt'] = 'appt';
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
    getSingleTime(slot) {
        if (slot) {
          const slots = slot.split('-');
          return this.shared_functions.convert24HourtoAmPm(slots[0]);
        }
      }
    getCommunicationHistory() {
        this.consumer_services.getConsumerCommunications(this.providerId)
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
        this.sharedServices.getFavProvider()
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
              this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }

    addFavProvider(id, event) {
        event.stopPropagation();
        if (!id) {
          return false;
        }
        this.sharedServices.addProvidertoFavourite(id)
          .subscribe(
            data => {
              this.getFavouriteProvider();
            },
            error => {
            }
          );
    }

    getAppointmentHistory(u_id, accid) {
      this.consumer_services.getApptHistory(u_id, accid)
      .subscribe(
          data => {
            console.log(data);
            this.apptHistory = data;
          },
          error => {
              this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
      );
    }
}
