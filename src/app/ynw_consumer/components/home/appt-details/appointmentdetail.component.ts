import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';
import { projectConstants } from '../../../../app.component';
import { AddInboxMessagesComponent } from '../../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { Location } from '@angular/common';
import { ConsumerServices } from '../../../services/consumer-services.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ActionPopupComponent } from '../action-popup/action-popup.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SubSink } from 'subsink';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { MeetingDetailsComponent } from '../../meeting-details/meeting-details.component';
import { TeleBookingService } from '../../../../shared/services/tele-bookings-service';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';

@Component({
  selector: 'app-appointmentdetail',
  templateUrl: './appointmentdetail.component.html',
  styleUrls: ['./appointmentdetail.component.css']
})
export class ApptDetailComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  elementType = 'url';
  api_loading = false;
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
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  dateTimeFormat = projectConstants.PIPE_DISPLAY_DATE_TIME_FORMAT;
  check_in_statuses = projectConstantsLocal.CHECK_IN_STATUSES;
  cust_notes_cap = '';
  providerId: any;
  addnotedialogRef: any;
  customer_label: any;
  no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP;
  ynwUuid: any;
  communication_history: any = [];
  appt;
  provider_label: any;
  qr_value: string;
  path = projectConstantsLocal.PATH;
  iconClass: string;
  view_more = false;
  actiondialogRef;
  fav_providers;
  fav_providers_id_list: any[];
  apptHistory: ArrayBuffer;
  questionnaire_heading = Messages.QUESTIONNAIRE_CONSUMER_HEADING;
  type;
  accountId: any;
  customId: any;
  questionnaires: any = [];
  whatsAppNumber: any;
  history: boolean  =false;
  constructor(
    private activated_route: ActivatedRoute,
    private dialog: MatDialog,
    public locationobj: Location,
    private router: Router,
    public shared_functions: SharedFunctions,
    @Inject(DOCUMENT) public document,
    private consumer_services: ConsumerServices,
    private sharedServices: SharedServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private dateTimeProcessor: DateTimeProcessor,
    private teleBookingService: TeleBookingService,
    private s3Processor: S3UrlProcessor
  ) {
    this.activated_route.queryParams.subscribe(
      (qParams) => {
        console.log("Mnai",qParams.providerId)
        this.ynwUuid = qParams.uuid;
        this.providerId = qParams.providerId;
        this.type = qParams.type;
        if (this.ynwUuid.startsWith('h_')) {
          this.history = true;
        }
        this.accountId = qParams.accountId;
        if (qParams && qParams.customId) {
          this.customId = qParams.customId;
        }
      });
      console.log("Terminologies");
      console.log(this.wordProcessor.getTerminologies())
  }
  ngOnInit() {
    if(this.providerId && this.providerId !== undefined){
    this.getCommunicationHistory();
    this.getApptDetails();
    this.getFavouriteProvider();
    }
    
  }
  processS3s(type, res) {
    let result = this.s3Processor.getJson(res);
    switch (type) {
      case 'terminologies': {
        this.wordProcessor.setTerminologies(result);
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
        this.cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP.replace('[customer]', this.customer_label);
        this.checkin_label = this.wordProcessor.getTerminologyTerm('checkin');
        this.no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP.replace('[customer]', this.customer_label);
        break;
      }
    }
  }
  getApptDetails() {
    // if(this.providerId && (this.providerId !== undefined ||  this.providerId !== '')){
    this.subs.sink = this.sharedServices.getAppointmentByConsumerUUID(this.ynwUuid, this.providerId).subscribe(
      (data) => {
        this.appt = data;
        console.log("Appointment Details By account ID : ",this.appt)

        if (this.appt && this.appt.providerAccount && this.appt.providerAccount.uniqueId) {
          this.subs.sink = this.s3Processor.getJsonsbyTypes(this.appt.providerAccount.uniqueId ,
            null, 'terminologies').subscribe(
              (accountS3s) => {
                if (accountS3s['terminologies']) {
                  this.processS3s('terminologies', accountS3s['terminologies']);
                }
              })
        }
        if(this.appt && this.appt.service && this.appt.service.virtualCallingModes){
          this.whatsAppNumber = this.teleBookingService.getTeleNumber(this.appt.virtualService[this.appt.service.virtualCallingModes[0].callingMode]);
        }
        console.log("Deatils:",this.appt)
        if (this.appt.questionnaires && this.appt.questionnaires.length > 0) {
          this.questionnaires = this.appt.questionnaires;
        }
        if (this.appt.releasedQnr && this.appt.releasedQnr.length > 0 && this.appt.apptStatus !== 'Cancelled') {
          const releasedQnrs = this.appt.releasedQnr.filter(qnr => qnr.status === 'released');
          if (releasedQnrs.length > 0) {
            this.getReleasedQnrs(releasedQnrs);
          }
        }
        this.api_loading = true;
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
            // Added by Mani
            case 'VideoCall': {
              this.iconClass = 'fa jvideo-icon jvideo-icon-s jvideo-icon-mgm5';
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
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    //}
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
    pass_ob['user_id'] = appt.providerAccount.id;
    pass_ob['userId'] = appt.providerAccount.uniqueId;
    pass_ob['name'] = appt.providerAccount.businessName;
    pass_ob['appt'] = 'appt';
    pass_ob['typeOfMsg'] = 'single';
    this.addNote(pass_ob);
  }
  addNote(pass_ob) {
    this.addnotedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'loginmainclass', 'smallform'],
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
      return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
  }
  getCommunicationHistory() {
    this.subs.sink = this.consumer_services.getConsumerCommunications(this.providerId)
      .subscribe(
        data => {
          console.log(" Communication History : ",data);
          const history: any = data;
          this.communication_history = [];
          for (const his of history) {
            if (his.waitlistId === this.ynwUuid) {
              this.communication_history.push(his);
              console.log(" Communication History Message : ",this);

            }
          }
          this.sortMessages();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  // getCommunicationHistory() {
  //   this.subs.sink = this.consumer_services.getConsumerCommunications(this.providerId)
  //     .subscribe(
  //       data => {
  //         const history: any = data;
  //         this.communication_history = [];
  //         for (const his of history) {
  //           if (his.waitlistId === this.ynwUuid) {
  //             this.communication_history.push(his);
  //           }
  //         }
  //         this.sortMessages();
  //       },
  //       error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //       }
  //     );
  // }
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
    if (this.customId) {
      this.router.navigate([this.customId]);
    } else {
      this.router.navigate(['searchdetail', provider.uniqueId]);
    }
  }

  viewMore() {
    this.view_more = !this.view_more;
  }
  gotoActions(booking) {
    if (this.customId) { 
      booking['customId'] = this.customId;
    }
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
    this.subs.sink = this.sharedServices.getFavProvider()
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
    if (this.fav_providers_id_list) {
      this.fav_providers_id_list.map((e) => {
        if (e === id) {
          fav = true;
        }
      });
    }
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
    this.subs.sink = this.sharedServices.addProvidertoFavourite(id)
      .subscribe(
        data => {
          this.getFavouriteProvider();
        },
        error => {
        }
      );
  }
  getAppointmentHistory(u_id, accid) {
    this.subs.sink = this.consumer_services.getApptHistory(u_id, accid)
      .subscribe(
        data => {
          this.apptHistory = data;
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  joinMeetitng(actionObj) {
    if (actionObj === 'appt') {
      this.getMeetingDetails(this.appt, 'appt');
    }
  }
  getMeetingDetails(details, source) {
    const passData = {
      'type': source,
      'details': details
    };
    this.addnotedialogRef = this.dialog.open(MeetingDetailsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: passData
    });
    this.addnotedialogRef.afterClosed().subscribe(result => {
    });
  }
  getReleasedQnrs(releasedQnrs) {
    this.sharedServices.getApptQuestionnaireByUid(this.ynwUuid, this.providerId)
      .subscribe(
        (data: any) => {
          const qnrs = data.filter(function (o1) {
            return releasedQnrs.some(function (o2) {
              return o1.id === o2.id;
            });
          });
          this.questionnaires = this.questionnaires.concat(qnrs);
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getQuestionAnswers(event) {
    if (event === 'reload') {
      this.getApptDetails();
    }
  }
  getQnrStatus(qnr) {
    const id = (qnr.questionnaireId) ? qnr.questionnaireId : qnr.id;
    const questr = this.appt.releasedQnr.filter(questionnaire => questionnaire.id === id);
    if (questr[0]) {
      return questr[0].status;
    }
  }
}
