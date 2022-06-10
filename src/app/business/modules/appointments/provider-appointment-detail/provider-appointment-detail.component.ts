import { Component, OnInit, OnDestroy, HostListener, Input } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Location } from "@angular/common";
import { SharedFunctions } from "../../../../shared/functions/shared-functions";
import { ProviderServices } from "../../../services/provider-services.service";
import { Messages } from "../../../../shared/constants/project-messages";
import { projectConstants } from "../../../../app.component";
import { projectConstantsLocal } from "../../../../shared/constants/project-constants";
import { ProviderSharedFuctions } from "../../../functions/provider-shared-functions";
import * as moment from "moment";
import { AddProviderWaitlistCheckInProviderNoteComponent } from "../../check-ins/add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component";
import { AppointmentActionsComponent } from "../appointment-actions/appointment-actions.component";
import { WordProcessor } from "../../../../shared/services/word-processor.service";
import { GroupStorageService } from "../../../../shared/services/group-storage.service";
import { SnackbarService } from "../../../../shared/services/snackbar.service";
import { DateTimeProcessor } from "../../../../shared/services/datetime-processor.service";
import { CommunicationService } from "../../../../business/services/communication-service";
import { BookingHistoryComponent } from "../booking-history/booking-history.component";
import { CommunicationPopupComponent } from "../../bookings/communication-popup/communication-popup.component";
// import { CommunicationPopupComponent } from "../../bookings/communication-popup/communication-popup.component";

@Component({
  selector: "app-provider-appointment-detail",
  templateUrl: "./provider-appointment-detail.component.html",
  styleUrls: ["./provider-app.component.css"]
})
export class ProviderAppointmentDetailComponent implements OnInit, OnDestroy {
  go_back_cap = Messages.CHECK_DET_GO_BACK_CAP;
  details_cap = Messages.CHECK_DET_DETAILS_CAP;
  name_cap = Messages.CHECK_DET_NAME_CAP;
  date_cap = Messages.CHECK_DET_DATE_CAP;
  location_cap = Messages.CHECK_DET_LOCATION_CAP;
  waitlist_for_cap = "Appointment for";
  service_cap = Messages.CHECK_DET_SERVICE_CAP;
  queue_cap = Messages.CHECK_DET_QUEUE_CAP;
  pay_status_cap = Messages.CHECK_DET_PAY_STATUS_CAP;
  not_paid_cap = Messages.CHECK_DET_NOT_PAID_CAP;
  partially_paid_cap = Messages.CHECK_DET_PARTIALLY_PAID_CAP;
  paid_cap = Messages.CHECK_DET_PAID_CAP;
  party_size_cap = Messages.CHECK_DET_PARTY_SIZE_CAP;
  send_msg_cap = Messages.CHECK_DET_SEND_MSG_CAP;
  add_pvt_note_cap = Messages.CHECK_DET_ADD_PRVT_NOTE_CAP;
  cancel_cap = Messages.CHECK_DET_CANCEL_CAP;
  communication_history_cap = Messages.CHECK_DET_COMM_HISTORY_CAP;
  pvt_notes_cap = Messages.CHECK_DET_PRVT_NOTES_CAP;
  cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP;
  no_pvt_notes_cap = Messages.CHECK_DET_NO_PVT_NOTES_FOUND_CAP;
  no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP;
  no_history_found = Messages.CHECK_DET_NO_HISTORY_FOUND_CAP;
  check_in_statuses = projectConstantsLocal.CHECK_IN_STATUSES;
  optinal_fields = Messages.DISPLAYBOARD_OPTIONAL_FIELDS;
  waitlist_id = null;
  waitlist_data;
  waitlist_notes: any = [];
  waitlist_history: any = [];
  settings: any = [];
  esttime: string = null;
  apptTime;
  communication_history: any = [];
  est_tooltip = Messages.ESTDATE;
  api_success = null;
  api_error = null;
  userDet;
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  timeFormat = projectConstants.PIPE_DISPLAY_TIME_FORMAT;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  dateTimeFormat = projectConstants.PIPE_DISPLAY_DATE_TIME_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  newTimeDateFormat = projectConstantsLocal.DATE_MM_DD_YY_HH_MM_A_FORMAT;

  today = new Date();
  customer_label = "";
  provider_label = "";
  checkin_label = "Appointment";
  checkin_upper = "";
  timeCaption = Messages.CHECKIN_TIME_CAPTION;
  minCaption = Messages.EST_WAIT_TIME_CAPTION;
  sendmsgdialogRef;
  notedialogRef;
  isCheckin;
  showEditView = false;
  api_loading = true;
  pdtype;
  editAppntTime = false;
  board_count = 0;
  showTimePicker = false;
  availableSlots: any = [];
  availableSlotDetails: any = [];
  callingModes = projectConstants.CALLING_MODES;
  pos = false;
  iconClass: string;
  spfname: any;
  splname: any;
  view_more = false;
  actiondialogRef: any;
  apptMultiSelection = false;
  timetype;
  showImages: any = [];
  internalStatuslog: any = [];
  statusLog: any = [];
  questionnaires: any = [];
  spName: any;
  teams: any;
  @Input() widget;
  appointmentModes = [
    { mode: "WALK_IN_APPOINTMENT", value: "Walk in " },
    { mode: "PHONE_IN_APPOINTMENT", value: "Phone in " },
    { mode: "ONLINE_APPOINTMENT", value: "Online " }
  ];
  bookinghistorydialogref: any;
  statusList: any;
  consumerBills: any = [];
  historyvisitDetails: any;
  small_device_display: boolean;
  action: string;
  whatsappNumber: any;
  mobileNumber: any;
  email: any;
  label_length: number;
  constructor(
    private provider_services: ProviderServices,
    private shared_Functionsobj: SharedFunctions,
    private dialog: MatDialog,
    private router: Router,
    private activated_route: ActivatedRoute,
    private locationobj: Location,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    private dateTimeProcessor: DateTimeProcessor,
    private communicationService: CommunicationService,
    private provider_shared_functions: ProviderSharedFuctions
  ) {
    this.activated_route.params.subscribe(params => {
      this.waitlist_id = params.id;
    });
    this.activated_route.queryParams.subscribe(params => {
      this.timetype = JSON.parse(params.timetype);
    });
    this.customer_label = this.wordProcessor.getTerminologyTerm("customer");
    this.provider_label = this.wordProcessor.getTerminologyTerm("provider");
    // this.checkin_label = this.wordProcessor.getTerminologyTerm('waitlist');
    // this.checkin_upper = this.wordProcessor.firstToUpper(this.checkin_label);
    this.cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP.replace(
      "[customer]",
      this.customer_label
    );
    this.no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP.replace(
      "[customer]",
      this.customer_label
    );
  }
  ngOnInit() {
    this.getPos();
    this.onResize();
    this.api_loading = true;
    this.pdtype = this.groupService.getitemFromGroupStorage("pdtyp");
    if (!this.pdtype) {
      this.pdtype = 1;
    }
    this.userDet = this.groupService.getitemFromGroupStorage("ynw-user");
    if (this.waitlist_id) {
      this.getProviderSettings();
    } else {
      this.goBack();
    }
    this.isCheckin = this.groupService.getitemFromGroupStorage("isCheckin");
    if (this.userDet.accountType === "BRANCH") {
      this.getTeams().then(data => {
        this.teams = data;
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }


  ngOnDestroy() {
    if (this.sendmsgdialogRef) {
      this.sendmsgdialogRef.close();
    }
    if (this.notedialogRef) {
      this.notedialogRef.close();
    }
  }
  getProviderSettings() {
    this.api_loading = true;
    this.provider_services.getWaitlistMgr().subscribe(
      data => {
        this.settings = data;
        this.getApptDetails();
        this.api_loading = false;
      },
      () => {
        this.api_loading = false;
      }
    );
  }

  editCustomerDetails() {
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'edit', id: this.waitlist_data.appmtFor[0].id }
    };
    this.router.navigate(['/provider/customers/create'], navigationExtras);
  }

  getConsumerBills() {
    const filter = { 'providerConsumer-eq': this.waitlist_data.appmtFor[0].id };
    this.provider_services.getProviderBills(filter).subscribe(data => {
      this.consumerBills = data;
    })
    console.log("consumer bills called")
  }

  getCustomerHistoryVisit() {
    this.provider_services.getCustomerHistoryVisit(this.waitlist_data.appmtFor[0].id).subscribe(
      (data: any) => {
        this.historyvisitDetails = data;
      }
    );
  }

  checkDataNull(value) {
    return value.trim() !== "";
  }
  getApptDetails() {
    this.provider_services.getAppointmentById(this.waitlist_id).subscribe(
      data => {
        this.waitlist_data = data;
        this.getConsumerBills();
        this.getCustomerHistoryVisit();
        if (this.waitlist_data.virtualService) {
          this.whatsappNumber = this.waitlist_data.virtualService.WhatsApp;
        }
        this.mobileNumber = this.waitlist_data.phoneNumber;
        this.email = this.waitlist_data.appmtFor[0].email;
        console.log("communication data", this.whatsappNumber, this.mobileNumber, this.email);
        console.log("waitlist data", this.waitlist_data);
        this.label_length = Object.keys(this.waitlist_data.label).length

        if (
          this.waitlist_data.questionnaires &&
          this.waitlist_data.questionnaires.length > 0
        ) {
          this.questionnaires = this.waitlist_data.questionnaires;
        }
        if (
          this.waitlist_data.releasedQnr &&
          this.waitlist_data.releasedQnr.length > 0
        ) {
          const releasedQnrs = this.waitlist_data.releasedQnr.filter(
            qnr => qnr.status === "released"
          );
          if (releasedQnrs.length > 0) {
            this.getReleasedQnrs(releasedQnrs);
          }
        }
        if (this.waitlist_data.service.serviceType === "virtualService") {
          switch (
          this.waitlist_data.service.virtualCallingModes[0].callingMode
          ) {
            case "Zoom": {
              this.iconClass = "fa zoom-icon";
              break;
            }
            case "VideoCall": {
              this.iconClass = "fa jvideo-icon jvideo-icon-s jvideo-icon-mgm5";
              break;
            }
            case "GoogleMeet": {
              this.iconClass = "fa meet-icon";
              break;
            }
            case "WhatsApp": {
              if (
                this.waitlist_data.service.virtualServiceType === "audioService"
              ) {
                this.iconClass = "fa wtsapaud-icon";
              } else {
                this.iconClass = "fa wtsapvid-icon";
              }
              break;
            }
            case "Phone": {
              this.iconClass = "fa phon-icon";
              break;
            }
          }
        }
        // this.getTimeSlots();
        if (this.waitlist_data.appmtTime) {
          this.apptTime = this.waitlist_data.appmtTime;
        }
        const waitlist_date = new Date(this.waitlist_data.date);
        this.today.setHours(0, 0, 0, 0);
        waitlist_date.setHours(0, 0, 0, 0);
        this.waitlist_data.history = false;
        if (this.today.valueOf() > waitlist_date.valueOf()) {
          this.waitlist_data.history = true;
        }
        if (this.waitlist_data.apptStatus !== "blocked") {
          this.getWaitlistNotes(this.waitlist_data.uid);
        }
        this.getCheckInHistory(this.waitlist_data.uid).then(data => {
          this.waitlist_history = data;
          console.log(
            "waitlist data..",
            this.waitlist_history,
            this.waitlist_data,
            this.check_in_statuses
          );
          this.getInternalStatusLog(this.waitlist_data.uid).then(status => {
            this.internalStatuslog = status;
            // this.statusLog.push(this.waitlist_history);
            // this.statusLog.push(this.internalStatuslog);
          });
        });
        this.getCommunicationHistory(this.waitlist_data.uid);
        if (this.waitlist_data.provider) {
          this.spName = this.waitlist_data.provider.businessName
            ? this.waitlist_data.provider.businessName
            : this.waitlist_data.provider.firstName +
            " " +
            this.waitlist_data.provider.lastName;
          this.spfname = this.waitlist_data.provider.firstName;
          this.splname = this.waitlist_data.provider.lastName;
        }
      },
      error => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror"
        });
        this.goBack();
      }
    );
  }
  getTimeMinute(time) {
    let hr;
    let min;
    if (time >= 60) {
      hr = Math.floor(time / 60);
      min = Math.floor(time % 60);
      return 'delayed by ' + hr + 'hr' + ':' + min + 'mins';
    }
    if (time < 60) {
      min = Math.floor(time % 60);
      return 'delayed by ' + min + 'mins';
    }

  }

  getWaitlistNotes(uuid) {
    this.provider_services.getProviderAppointmentNotes(uuid).subscribe(
      data => {
        this.waitlist_notes = data;
      },
      () => {
        //  this.snackbarService.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
      }
    );
  }
  getCheckInHistory(uuid) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getProviderAppointmentHistory(uuid).subscribe(
        data => {
          resolve(data);
        },
        () => {
          reject();
        }
      );
    });
  }
  getInternalStatusLog(uuid) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services
        .getProviderAppointmentInternalStatusHistory(uuid)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }

  getCommunicationHistory(uuid) {
    this.provider_services.getProviderInbox().subscribe(
      data => {
        const history: any = data;
        this.communication_history = [];
        for (const his of history) {
          if (
            his.waitlistId === uuid ||
            his.waitlistId === uuid.replace("h_", "")
          ) {
            this.communication_history.push(his);
          }
        }
        this.sortMessages();
        this.shared_Functionsobj.sendMessage({
          ttype: "load_unread_count",
          action: "setzero"
        });
      },
      () => {
        //  this.snackbarService.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
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

  goBack() {
    this.api_loading = false;
    this.router.navigate(["provider"]);
  }

  addProviderNote(checkin) {
    console.log("dialog box opened");
    this.notedialogRef = this.dialog.open(
      AddProviderWaitlistCheckInProviderNoteComponent,
      {
        width: "50%",
        panelClass: ["popup-class", "commonpopupmainclass"],
        disableClose: true,
        data: {
          checkin_id: checkin.uid,
          source: "appt"
        }
      }
    );
    this.notedialogRef.afterClosed().subscribe(result => {
      console.log("Outside If condition")
      if (result === "reloadlist") {
        console.log("Inside If condition")
        this.getWaitlistNotes(this.waitlist_data.uid);
      }
    });
  }

  changeWaitlistStatus(action) {
    this.provider_shared_functions.changeWaitlistStatus(
      this,
      this.waitlist_data,
      action,
      "appt"
    );
  }

  changeWaitlistStatusAction() {
    this.action = 'status';
    console.log(this.action);
  }

  changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    this.provider_shared_functions
      .changeApptStatusApi(this, waitlist, action, post_data)
      .then(() => {
        this.getApptDetails();
      });
  }

  addConsumerInboxMessage() {
    const waitlist = [];
    waitlist.push(this.waitlist_data);
    const uuid = this.waitlist_data.uid || null;
    this.communicationService
      .addConsumerInboxMessage(waitlist, this, "appt")
      .then(
        () => {
          this.getCommunicationHistory(uuid);
        },
        () => { }
      );
  }
  gotoPrev() {
    this.locationobj.back();
  }
  // getTimeSlots() {
  //   this.provider_services.getAppointmentSlotsByDate(this.waitlist_data.schedule.id, this.waitlist_data.appmtDate).subscribe(data => {
  //     this.availableSlots = data;
  //     this.availableSlotDetails = this.availableSlots.availableSlots.filter(slot => slot.noOfAvailbleSlots !== '0' || (slot.time === this.waitlist_data.appmtTime && slot.noOfAvailbleSlots === '0'));
  //   });
  // }
  getAppxTime(waitlist, retcap?) {
    if (this.checkTimedisplayAllowed(waitlist)) {
      if (waitlist.queue.queueStartTime !== undefined) {
        if (waitlist.hasOwnProperty("serviceTime")) {
          if (retcap) {
            return this.timeCaption;
          } else {
            return waitlist.serviceTime;
          }
        } else {
          if (retcap) {
            return "Date"; // this.minCaption;
          } else {
            return this.dateTimeProcessor.convertMinutesToHourMinute(
              waitlist.appxWaitingTime
            );
          }
        }
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  }
  checkTimedisplayAllowed(waitlist) {
    if (
      (waitlist.appointmentStatus === "Arrived" ||
        waitlist.appointmentStatus === "Confirmed") &&
      !this.checkIsHistory(waitlist)
    ) {
      if (waitlist.queue.queueStartTime !== undefined) {
        return true;
      }
    }
    return false;
  }

  checkIsHistory(waitlist) {
    const dd = this.today.getDate();
    const mm = this.today.getMonth() + 1; // January is 0!
    const yyyy = this.today.getFullYear();
    let cday = "";
    if (dd < 10) {
      cday = "0" + dd;
    } else {
      cday = "" + dd;
    }
    let cmon;
    if (mm < 10) {
      cmon = "0" + mm;
    } else {
      cmon = "" + mm;
    }
    const checkindate = waitlist.date;
    const dtoday = yyyy + "-" + cmon + "-" + cday;
    const date1 = new Date(checkindate);
    const date2 = new Date(dtoday);
    if (date2.getTime() > date1.getTime()) {
      return true;
    } else {
      return false;
    }
  }
  AMHourto24(date, time12) {
    const time = time12;
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === "PM" && hours < 12) {
      hours = hours + 12;
    }
    if (AMPM === "AM" && hours === 12) {
      hours = hours - 12;
    }
    const sHours = hours;
    const sMinutes = minutes;
    const mom_date = moment(date);
    mom_date.set("hour", sHours);
    mom_date.set("minute", sMinutes);
    return mom_date;
  }
  editClicked() {
    this.showEditView = true;
  }
  cancelClicked() {
    this.showEditView = false;
    this.esttime = "";
  }

  saveClicked(esttime) {
    if (esttime) {
      this.provider_services
        .editWaitTime(this.waitlist_data.uid, esttime)
        .subscribe(
          () => {
            this.showEditView = false;
            this.getApptDetails();
          },
          error => {
            this.snackbarService.openSnackBar(error, {
              panelClass: "snackbarerror"
            });
          }
        );
    }
    this.esttime = "";
  }
  isNumeric(evt) {
    return this.shared_Functionsobj.isNumeric(evt);
  }
  isvalid(evt) {
    return this.shared_Functionsobj.isValid(evt);
  }
  editApptTime() {
    // tslint:disable-next-line: radix
    this.editAppntTime = true;
    this.apptTime = this.waitlist_data.appmtTime;
  }
  cancelUpdation() {
    this.editAppntTime = false;
  }


  showCommunications() {

    if (this.whatsappNumber && this.mobileNumber && this.email) {
      console.log("communication data : 1");
      this.dialog.open(CommunicationPopupComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'newPopupClass'],
        disableClose: true,
        data: {
          whatsappNumber: this.whatsappNumber,
          number: this.mobileNumber,
          customerId: this.waitlist_data.appmtFor[0].id,
          email: this.email,
          type: 'customer'
        }
      });
    }
    else if (!this.whatsappNumber && this.mobileNumber == 'null' && this.email) {
      console.log("communication data : 2");
      this.dialog.open(CommunicationPopupComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'newPopupClass'],
        disableClose: true,
        data: {
          customerId: this.waitlist_data.appmtFor[0].id,
          email: this.email,
          type: 'customer'
        }
      });
    }
    else if (!this.whatsappNumber && this.mobileNumber && !this.email) {
      console.log("communication data : 3");
      this.dialog.open(CommunicationPopupComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'newPopupClass'],
        disableClose: true,
        data: {
          number: this.mobileNumber,
          customerId: this.waitlist_data.appmtFor[0].id,
          type: 'customer'
        }
      });
    }
    else if (!this.whatsappNumber && this.mobileNumber && this.email) {
      console.log("communication data : 4");
      this.dialog.open(CommunicationPopupComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'newPopupClass'],
        disableClose: true,
        data: {
          number: this.mobileNumber,
          email: this.email,
          customerId: this.waitlist_data.appmtFor[0].id,
          type: 'customer'
        }
      });
    }
    else if (this.whatsappNumber && this.mobileNumber == 'null' && !this.email) {
      console.log("communication data : 5", this.email);
      this.dialog.open(CommunicationPopupComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'newPopupClass'],
        disableClose: true,
        data: {
          whatsappNumber: this.whatsappNumber,
          customerId: this.waitlist_data.appmtFor[0].id,
          type: 'customer'
        }
      });
    }
    else if (this.whatsappNumber && this.mobileNumber == 'null' && this.email) {
      console.log("communication data : 6");
      this.dialog.open(CommunicationPopupComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'newPopupClass'],
        disableClose: true,
        data: {
          whatsappNumber: this.whatsappNumber,
          email: this.email,
          customerId: this.waitlist_data.appmtFor[0].id,
          type: 'customer'
        }
      });
    }
    else if (this.whatsappNumber && this.mobileNumber && !this.email) {
      console.log("communication data : 7");
      this.dialog.open(CommunicationPopupComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'newPopupClass'],
        disableClose: true,
        data: {
          whatsappNumber: this.whatsappNumber,
          number: this.mobileNumber,
          customerId: this.waitlist_data.appmtFor[0].id,
          type: 'customer'
        }
      });
    }
  }


  saveApptTime(time) {
    this.provider_services
      .updateApptTime(this.waitlist_data.uid, time)
      .subscribe(
        () => {
          this.editAppntTime = false;
          this.getApptDetails();
        },
        error => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror"
          });
        }
      );
  }
  getDisplayboardCount() {
    let layout_list: any = [];
    this.provider_services.getDisplayboardsAppointment().subscribe(data => {
      layout_list = data;
      this.board_count = layout_list.length;
    });
  }
  setApptTime() {
    this.showTimePicker
      ? (this.showTimePicker = false)
      : (this.showTimePicker = true);
  }
  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }
  getSingleTime(slot) {
    const slots = slot.split("-");
    // const min = parseInt(slot[1], 10);
    // console.log("Minutes :",'delay by '+this.addZero(min) + 'mins')
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  formatDateDisplay(dateStr) {
    dateStr = JSON.parse(dateStr);
    // console.log("Time :",dateStr)
    let retdate = '';
    const pubDate = new Date(dateStr);
    const obtdate = new Date(pubDate.getFullYear() + '-' + this.dateTimeProcessor.addZero((pubDate.getMonth() + 1)) + '-' + this.dateTimeProcessor.addZero(pubDate.getDate()));
    const obtshowdate = this.dateTimeProcessor.addZero(pubDate.getDate()) + '/' + this.dateTimeProcessor.addZero((pubDate.getMonth() + 1)) + '/' + pubDate.getFullYear();
    const obtshowtime = this.dateTimeProcessor.addZero(pubDate.getHours()) + ':' + this.dateTimeProcessor.addZero(pubDate.getMinutes());
    const today = new Date();
    const todaydate = new Date(today.getFullYear() + '-' + this.dateTimeProcessor.addZero((today.getMonth() + 1)) + '-' + this.dateTimeProcessor.addZero(today.getDate()));

    if (obtdate.getTime() === todaydate.getTime()) {
      retdate = this.dateTimeProcessor.convert24HourtoAmPm(obtshowtime);
    } else {
      retdate = obtshowdate + ' ' + this.dateTimeProcessor.convert24HourtoAmPm(obtshowtime);
    }
    return retdate;
  }
  getPos() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data["enablepos"];
    });
  }

  viewMore() {
    this.view_more = !this.view_more;
  }
  getAgent(fileName) {
    if (fileName) {
      return fileName.toLocaleLowerCase();
    }
  }
  getReqFrom(browser, agent) {
    let browserName = "";
    if (browser) {
      if (browser.includes("Android")) {
        browserName = 'Android'
        return browserName.toLocaleLowerCase();

      }
      if (browser.includes("iPhone")) {
        browserName = 'IOS'
        return browserName.toLocaleLowerCase();

      }
      if (browser.includes("Windows") || browser.includes("Intel Mac OS") || browser.includes("iPhone")) {
        browserName = 'Web'
        return browserName.toLocaleLowerCase();

      }
    }
    if (browser === undefined && agent === "BROWSER") {
      browserName = "web";
      return browserName;
    }
  }
  getBookingReqFrom(browser, reqFrom) {
    let browserName = "";
    if (browser) {
      if (browser.includes("Android")) {
        browserName = 'Android'
        return browserName.toLocaleLowerCase();

      }
      if (browser.includes("iPhone")) {
        browserName = 'IOS'
        return browserName.toLocaleLowerCase();

      }
      if (browser.includes("Windows") || browser.includes("Intel Mac OS") || browser.includes("Linux") || browser.includes("CrOS")) {
        browserName = 'Web'
        return browserName.toLocaleLowerCase();

      }


    }
    if (browser === undefined && reqFrom === "SP_APP" || "CONSUMER_APP") {
      browserName = "App";
      return browserName.toLocaleLowerCase();
    }

    return browserName.toLocaleLowerCase();
  }

  gotoActions(checkin?) {
    let waitlist = [];
    if (checkin) {
      waitlist = checkin;
    }
    const actiondialogRef = this.dialog.open(AppointmentActionsComponent, {
      width: "50%",
      panelClass: ["popup-class", "commonpopupmainclass", "checkinactionclass"],
      disableClose: true,
      data: {
        checkinData: waitlist,
        multiSelection: this.apptMultiSelection,
        timetype: this.timetype,
        NoViewDetail: "true"
      }
    });
    actiondialogRef.afterClosed().subscribe(data => {
      console.log("Actions Appt :", data);
      this.getProviderSettings();
    });
  }
  showImagesection(index) {
    this.showImages[index]
      ? (this.showImages[index] = false)
      : (this.showImages[index] = true);
  }
  getThumbUrl(attachment) {
    if (attachment.s3path.indexOf(".pdf") !== -1) {
      return attachment.thumbPath;
    } else {
      return attachment.s3path;
    }
  }
  getReleasedQnrs(releasedQnrs) {
    this.provider_services
      .getApptQuestionnaireByUid(this.waitlist_data.uid)
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
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror"
          });
        }
      );
  }
  getQuestionAnswers(event) {
    if (event === "reload") {
      this.getApptDetails();
    }
  }
  getQnrStatus(qnr) {
    const id = qnr.questionnaireId ? qnr.questionnaireId : qnr.id;
    const questr = this.waitlist_data.releasedQnr.filter(
      questionnaire => questionnaire.id === id
    );
    if (questr[0]) {
      return questr[0].status;
    }
  }
  getTeams() {
    const _this = this;
    return new Promise<void>(function (resolve) {
      _this.provider_services.getTeamGroup().subscribe(
        data => {
          _this.teams = data;
        },
        () => {
          resolve();
        }
      );
    });
  }
  getUsersList(teamid) {
    const userObject = this.teams.filter(user => parseInt(user.id) === teamid);
    if (userObject[0] && userObject[0].name) {
      return userObject[0].name;
    }
  }
  getAppointmentMode(mode) {
    let currentmode = [];
    currentmode = this.appointmentModes.filter(obj => obj.mode === mode);
    return currentmode[0].value;
  }

  openbookinghistory() {
    this.bookinghistorydialogref = this.dialog.open(BookingHistoryComponent, {
      width: "100%",
      height: "auto",
      data: {
        type: "Appointment History",
        providername: this.spName,
        appointmentby: this.waitlist_data.apptBy,
        bookingmode: this.getAppointmentMode(
          this.waitlist_data.appointmentMode
        ),
        consumername:
          this.waitlist_data.appmtFor[0].firstName +
          " " +
          this.waitlist_data.appmtFor[0].lastName,
        details: this.waitlist_history
      }
    });
  }
}
