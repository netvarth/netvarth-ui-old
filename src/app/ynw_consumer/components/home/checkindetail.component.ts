import { Component, Inject, OnInit } from '@angular/core';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../app.component';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { MatDialog } from '@angular/material';
import { DOCUMENT } from '@angular/common';
import { Location } from '@angular/common';
import { ConsumerServices } from '../../services/consumer-services.service';

@Component({
    selector: 'app-checkindetail',
    templateUrl: './checkindetail.component.html'
})
export class CheckinDetailComponent implements OnInit {
    waitlist: any;
    // breadcrumbs = [
    //     {
    //         title: 'Dashboard',
    //         url: '/consumer'
    //     },
    //     {
    //         title: 'Checkin Details'
    //     }
    // ];
    api_loading = true;
    waitlistdata: any;
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
    status_cap;
    BusinessName: any;
    date: any;
    firstname: any;
    lastname: any;
    checkin_label = '';
    details_cap = Messages.CHECK_DET_DETAILS_CAP;
    dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    dateTimeFormat = projectConstants.PIPE_DISPLAY_DATE_TIME_FORMAT;
    cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP;
    locn: any;
    service: any;
    deptName: any;
    queueStart: any;
    queueEnd: any;
    paymntstats: any;
    batchname: any;
    status: any;
    ProviderId: any;
    addnotedialogRef: any;
    customer_label: any;
    no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP;
    consumerNote: any;
    ynwUuid: any;
    communication_history: any = [];
    statusUpdatedTime: any;
    callingModes;
    callingModesDisplayName = projectConstants.CALLING_MODES;
    phonenumber;
    servsDetails: any;
    iconClass: string;
    showtoken: any;
    breadcrumbs = [];
    tokennumber: any;
    waitlistjson: any = [];
    constructor(
        private activated_route: ActivatedRoute,
        private dialog: MatDialog,
        public locationobj: Location,
        private shared_functions: SharedFunctions,
        @Inject(DOCUMENT) public document,
        private consumer_services: ConsumerServices,
        private shared_Functionsobj: SharedFunctions,
    ) {
        this.activated_route.queryParams.subscribe(
            (qParams) => {
                this.waitlistdata = qParams;
            });
        this.waitlist = this.waitlistdata.waitlist || null;
        this.waitlistjson = JSON.parse(this.waitlist);
        this.BusinessName = this.waitlistjson.providerAccount.businessName;
        this.ProviderId = this.waitlistjson.providerAccount.id;
        this.ynwUuid = this.waitlistjson.ynwUuid;
        this.date = this.waitlistjson.date;
        this.locn = this.waitlistjson.queue.location.place;
        this.firstname = this.waitlistjson.waitlistingFor[0].firstName;
        this.lastname = this.waitlistjson.waitlistingFor[0].lastName;
        this.service = this.waitlistjson.service.name;
        this.deptName = this.waitlistjson.service.deptName;
        this.queueStart = this.waitlistjson.queue.queueStartTime;
        this.queueEnd = this.waitlistjson.queue.queueEndTime;
        this.paymntstats = this.waitlistjson.paymentStatus;
        this.batchname = this.waitlistjson.batchName;
        this.status = this.waitlistjson.waitlistStatus;
        this.statusUpdatedTime = this.waitlistjson.statusUpdatedTime;
        this.consumerNote = this.waitlistjson.consumerNote;
        this.callingModes = this.waitlistjson.virtualService;
        this.customer_label = this.shared_Functionsobj.getTerminologyTerm('customer');
        this.cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP.replace('[customer]', this.customer_label);
        this.checkin_label = this.shared_Functionsobj.getTerminologyTerm('checkin');
        this.no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP.replace('[customer]', this.customer_label);
        this.phonenumber = this.waitlistjson.waitlistPhoneNumber;
        this.servsDetails = this.waitlistjson.service;
        if (this.waitlistjson.token) {
            this.tokennumber = this.waitlistjson.token;
        }
        this.showtoken = this.waitlistjson.showToken;
        if (this.showtoken) {
            this.breadcrumbs = [
                {
                    title: 'Dashboard',
                    url: '/consumer'
                },
                {
                    title: 'Token Details'
                }
            ];
        } else {
            this.breadcrumbs = [
                {
                    title: 'Dashboard',
                    url: '/consumer'
                },
                {
                    title: 'Checkin Details'
                }
            ];
        }
        if (this.servsDetails.serviceType === 'virtualService') {

            switch (this.servsDetails.virtualCallingModes[0].callingMode) {
                case 'Zoom': {
                    this.iconClass = 'fa zoom-icon';
                    break;
                }
                case 'GoogleMeet': {
                    this.iconClass = 'fa meet-icon';
                    break;
                }
                case 'WhatsApp': {
                    this.iconClass = 'fa wtsapaud-icon';
                    break;
                }
                case 'Phone': {
                    this.iconClass = 'fa phon-icon';
                    break;
                }
            }
        }
    }
    ngOnInit() {
    }
    gotoPrev() {
        this.locationobj.back();
    }
    addCommonMessage(waitlistdata) {
        const pass_ob = {};
        pass_ob['source'] = 'consumer-waitlist';
        pass_ob['uuid'] = this.ynwUuid;
        pass_ob['user_id'] = this.ProviderId;
        pass_ob['name'] = this.BusinessName;
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
        this.consumer_services.getConsumerCommunications(this.ProviderId)
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
}
