import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { CustomerActionsComponent } from '../customer-actions/customer-actions.component';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
// import { interval as observableInterval } from 'rxjs';
import { SubSink } from 'subsink';
@Component({
    selector: 'app-customer-details',
    templateUrl: './customer-details.component.html',
    styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailComponent implements OnInit {
    dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
    newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
    mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
    amForm: FormGroup;
    api_error = null;
    api_success = null;
    step = 1;
    tday = new Date();
    minday = new Date(1900, 0, 1);
    search_data = null;
    disableButton = false;
    customer_label = '';
    source;
    phoneNo: any;
    email: any;
    firstName: any;
    lastName: any;
    dob: any;
    action;
    form_data = null;
    create_new = false;
    qParams = {};
    foundCustomer = false;
    searchClicked = false;
    customer_data: any = [];
    customerPhone: any;
    breadcrumb_moreoptions: any = [];
    checkin_type;
    customidFormat;
    loading = true;
    haveMobile = true;
    viewCustomer = false;
    customerId;
    customer;
    customerName;
    timeslot;
    comingSchduleId;
    date;
    thirdParty;
    customerCount;
    customerPlaceholder = '';
    jld;
    customerErrorMsg = '';
    customerErrorMsg1 = '';
    customerErrorMsg2 = '';
    serviceIdParam;
    userId;
    deptId;
    type;
    customerDetails: any = [];
    todayvisitDetails: any = [];
    futurevisitDetails: any = [];
    historyvisitDetails: any = [];
    historyOrdervisitDetails: any = [];
    ordervisitDetails: any = [];
    todayordervisitDetails: any = [];
    futureordervisitDetails: any = [];
    customerAction = '';
    waitlistModes = {
        WALK_IN_CHECKIN: 'Walk in Check-in',
        PHONE_CHECKIN: 'Phone in Check-in',
        ONLINE_CHECKIN: 'Online Check-in',
        WALK_IN_APPOINTMENT: 'Walk in Appointment',
        PHONE_IN_APPOINTMENT: 'Phone in Appointment',
        ONLINE_APPOINTMENT: 'Online Appointment'
    };
    tokenWaitlistModes = {
        WALK_IN_CHECKIN: 'Walk in Token',
        PHONE_CHECKIN: 'Phone in Token',
        ONLINE_CHECKIN: 'Online Token'
    };
    domain;
    communication_history: any = [];
    todayVisitDetailsArray: any = [];
    futureVisitDetailsArray: any = [];
    todayorderVisitDetailsArray: any = [];
    futureorderVisitDetailsArray: any = [];
    historyorderVisitDetailsArray: any = [];
    historyVisitDetailsArray: any = [];
    showMoreFuture = false;
    showMoreToday = false;
    showMoreHistory = false;
    showMoreOrderHistory = false;
    showMoreorderFuture = false;
    showMoreorderToday = false;
    selectedDetailsforMsg: any = [];
    uid;
    customernotes = '';
    subdomain;
    showToken;
    questionnaireList: any = [];
    showQuestionnaire = false;
    subs = new SubSink();
    refreshTime = 10;
    linkStatus: any;
    meetingStatus: string;
    showEndBt: boolean;
    showRejoinBt: boolean;
    consumerBills: any = [];
    constructor(
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute,
        private _location: Location, public dialog: MatDialog,
        private router: Router,
        private wordProcessor: WordProcessor,
        private dateTimeProcessor: DateTimeProcessor,
        private groupService: GroupStorageService) {
        const customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.customer_label = customer_label.charAt(0).toUpperCase() + customer_label.slice(1).toLowerCase();
        this.customernotes = this.customer_label + ' note';
        this.activated_route.queryParams.subscribe(qparams => {
            const user = this.groupService.getitemFromGroupStorage('ynw-user');
            this.domain = user.sector;
            this.subdomain = user.subSector;
            this.source = qparams.source;
            this.showToken = qparams.showtoken;
            if (qparams.uid) {
                this.uid = qparams.uid;
            }
            if (qparams.type) {
                this.type = qparams.type;
            }
            if (qparams.checkinType) {
                this.checkin_type = qparams.checkinType;
            }
            if (qparams.thirdParty) {
                this.thirdParty = qparams.thirdParty;
            }
        });

        this.activated_route.params.subscribe(
            (params) => {
                this.customerId = params.id;
                this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
                if (this.customerId) {
                    this.activated_route.queryParams.subscribe(
                        (qParams) => {
                            this.action = qParams.action;
                            this.getCustomers(this.customerId).then(
                                (customer) => {
                                    this.customer = customer;
                                    this.getConsumerBills();
                                    this.customerName = this.customer[0].firstName;
                                    this.viewCustomer = true;
                                    this.loading = false;
                                    if (this.customerId) {
                                        this.getCustomerTodayVisit();
                                        this.getCustomerFutureVisit();
                                        this.getCustomerHistoryVisit();
                                        this.getCustomerOrderVisit();
                                    }
                                }
                            );
                        }
                    );
                }
            }
        );

    }
    getCustomers(customerId) {
        const _this = this;
        const filter = { 'id-eq': customerId };
        return new Promise(function (resolve, reject) {
            _this.provider_services.getProviderCustomers(filter)
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
    ngOnInit() {
        this.getCustomerQnr();
    }
    onCancel() {
        if (this.source === 'checkin' || this.source === 'token') {
            const showtoken = (this.source === 'checkin') ? false : true;
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    checkin_type: this.checkin_type,
                    haveMobile: this.haveMobile,
                    thirdParty: this.thirdParty,
                    showtoken: showtoken
                }
            };
            this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
        } else if (this.source === 'appointment') {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    checkinType: this.checkin_type,
                    haveMobile: this.haveMobile,
                    timeslot: this.timeslot,
                    scheduleId: this.comingSchduleId,
                    date: this.date,
                    thirdParty: this.thirdParty,
                    serviceId: this.serviceIdParam,
                    userId: this.userId,
                    deptId: this.deptId,
                    type: this.type
                }
            };
            this.router.navigate(['provider', 'appointments', 'appointment'], navigationExtras);
        } else {
            this._location.back();
        }
    }
    editCustomer() {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit' }
        };
        this.router.navigate(['/provider/customers/' + this.customer[0].id], navigationExtras);
    }
   
    // goMeetProvider() {
    //     const navigationExtras: NavigationExtras = {
    //         queryParams: { custId: this.customerId }
    //     };
    //     // const path = 'meet/' + this.id ;
    //     // window.open(path, '_blank');
    //     this.router.navigate(['meet', this.id], navigationExtras);
    // }
    // getMeetingStatus() {
       
    //     this.showStartBt = true;
    //     this.provider_services.getStatus(this.id).subscribe(
    //         (data: any) => {
    //             this.linkStatus = data.linkStatus;
    //             this.meetingStatus = data.meetingStatus;
    //             if (this.meetingStatus === 'REQUESTED' && this.linkStatus === 'ENABLED') {
    //                 this.showStartBt = true;
    //                 this.showRejoinBt = false;
    //                 this.showEndBt = false;
    //             }
    //             else if (this.meetingStatus === 'STARTED' && this.linkStatus === 'ENABLED') {

    //                 this.showStartBt = true;
    //                 this.showRejoinBt = false;
    //                 this.showEndBt = false;
    //             }
    //             else if (this.meetingStatus === 'INTERRUPTED' && this.linkStatus === 'ENABLED') {
    //                 this.showStartBt = false;
    //                 this.showRejoinBt = true;
    //                 this.showEndBt = false;
    //             }
    //             else {
    //                 this.showStartBt = false;
    //                 this.showRejoinBt = false;
    //                 this.showEndBt = true;
    //             }
    //         }
    //     );
    // }
    getCustomerTodayVisit() {
        this.provider_services.getCustomerTodayVisit(this.customerId).subscribe(
            (data: any) => {
                this.todayVisitDetailsArray = data;
                this.todayvisitDetails = this.todayVisitDetailsArray.slice(0, 5);
            }
        );
    }
    getCustomerFutureVisit() {
        this.provider_services.getCustomerFutureVisit(this.customerId).subscribe(
            (data: any) => {
                this.futureVisitDetailsArray = data;
                this.futurevisitDetails = this.futureVisitDetailsArray.slice(0, 5);
            }
        );
    }
    getCustomerHistoryVisit() {
        this.loading = true;
        this.provider_services.getCustomerHistoryVisit(this.customerId).subscribe(
            (data: any) => {
                this.historyVisitDetailsArray = data;
                this.historyvisitDetails = this.historyVisitDetailsArray.slice(0, 5);
                this.loading = false;
            }
        );
    }
    getCustomerOrderVisit() {
        this.loading = true;
        this.provider_services.getCustomerOrderVisit(this.customerId).subscribe(
            (data: any) => {
                this.ordervisitDetails = data;
                this.todayorderVisitDetailsArray = data.todayOrders;
                this.todayordervisitDetails = this.todayorderVisitDetailsArray.slice(0, 5);
                this.futureorderVisitDetailsArray = data.futureOrders;
                this.futureordervisitDetails = this.futureorderVisitDetailsArray.slice(0, 5);
                this.historyorderVisitDetailsArray = data.historyOrders;
                this.historyOrdervisitDetails = this.historyorderVisitDetailsArray.slice(0, 5);
                this.loading = false;
            }
        );
    }
    stopprop(event) {
        event.stopPropagation();
    }
    medicalRecord(visitDetails) {
        if (visitDetails.waitlist) {
            let mrId = 0;
            if (visitDetails.waitlist.mrId) {
                mrId = visitDetails.waitlist.mrId;
            }
            const customerDetails = visitDetails.waitlist.waitlistingFor[0];
            const customerId = customerDetails.id;
            const bookingId = visitDetails.waitlist.ynwUuid;
            const bookingType = 'TOKEN';
            this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId]);
        } else if (visitDetails.appointmnet) {
            let mrId = 0;
            if (visitDetails.appointmnet.mrId) {
                mrId = visitDetails.appointmnet.mrId;
            }
            const customerDetails = visitDetails.appointmnet.appmtFor[0];
            const customerId = customerDetails.id;
            const bookingId = visitDetails.appointmnet.uid;
            const bookingType = 'APPT';
            this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId]);
        }
    }
    prescription(visitDetails) {
        if (visitDetails.waitlist) {
            let mrId = 0;
            if (visitDetails.waitlist.mrId) {
                mrId = visitDetails.waitlist.mrId;
            }
            const customerDetails = visitDetails.waitlist.waitlistingFor[0];
            const customerId = customerDetails.id;
            const bookingId = visitDetails.waitlist.ynwUuid;
            const bookingType = 'TOKEN';
            this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription']);
        } else if (visitDetails.appointmnet) {
            let mrId = 0;
            if (visitDetails.appointmnet.mrId) {
                mrId = visitDetails.appointmnet.mrId;
            }
            const customerDetails = visitDetails.appointmnet.appmtFor[0];
            const customerId = customerDetails.id;
            const bookingId = visitDetails.appointmnet.uid;
            const bookingType = 'APPT';
            this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription']);
        }

    }
    gotoCustomerDetail(visit, time_type) {
        if (visit.waitlist) {
            this.router.navigate(['provider', 'bookings', visit.waitlist.ynwUuid], { queryParams: { timetype: time_type, type: 'checkin' } });
        } else if (visit.appointmnet) {
            this.router.navigate(['provider', 'bookings', visit.appointmnet.uid], { queryParams: { timetype: time_type, type: 'appointment' } });
        } else {
            this.router.navigate(['provider', 'orders', visit.uid], { queryParams: { timetype: time_type } });
        }
    }
    goBack() {
        this._location.back();
    }
    showConsumerNote(visitDetail) {
        let type;
        let checkin;
        if (visitDetail.waitlist) {
            type = 'checkin';
            checkin = visitDetail.waitlist;
        } else {
            type = 'appt';
            checkin = visitDetail.appointmnet;
        }
        const notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                checkin: checkin,
                type: type
            }
        });
        notedialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
            }
        });
    }
    showCustomerAction() {
        const notedialogRef = this.dialog.open(CustomerActionsComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                customer: this.customer,
            }
        });
        notedialogRef.afterClosed().subscribe(result => {
            if (result === 'edit') {
                this.editCustomer();
            } else {
                this.getCustomers(this.customerId).then(
                    (customer) => {
                        this.customer = customer;
                    });
            }
        });
    }
    showCommHistory(visitdetails) {
        this.loading = true;
        this.customerAction = 'inbox';
        this.selectedDetailsforMsg = visitdetails;
        this.getCommunicationHistory();
    }
    getCommunicationHistory() {
        let uuid;
        if (this.selectedDetailsforMsg.waitlist) {
            uuid = this.selectedDetailsforMsg.waitlist.ynwUuid;
        } else if (this.selectedDetailsforMsg.appointmnet) {
            uuid = this.selectedDetailsforMsg.appointmnet.uid;
        } else {
            uuid = this.selectedDetailsforMsg.uid;
        }
        this.provider_services.getProviderInbox()
            .subscribe(
                data => {
                    const history: any = data;
                    this.communication_history = [];
                    for (const his of history) {
                        if (his.waitlistId === uuid || his.waitlistId === uuid.replace('h_', '')) {
                            this.communication_history.push(his);
                        }
                    }
                    this.sortMessages();
                    this.loading = false;
                    this.shared_functions.sendMessage({ 'ttype': 'load_unread_count', 'action': 'setzero' });
                },
                () => {
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
    goBackfromAction() {
        this.customerAction = '';
    }
    showMore(type) {
        if (type === 'today') {
            this.todayvisitDetails = this.todayVisitDetailsArray;
            this.showMoreToday = true;
        } else if (type === 'future') {
            this.futurevisitDetails = this.futureVisitDetailsArray;
            this.showMoreFuture = true;
        } else {
            this.historyvisitDetails = this.historyVisitDetailsArray;
            this.showMoreHistory = true;
        }
    }
    showLess(type) {
        if (type === 'today') {
            this.todayvisitDetails = this.todayVisitDetailsArray.slice(0, 5);
            this.showMoreToday = false;
        } else if (type === 'future') {
            this.futurevisitDetails = this.futureVisitDetailsArray.slice(0, 5);
            this.showMoreFuture = false;
        } else {
            this.historyvisitDetails = this.historyVisitDetailsArray.slice(0, 5);
            this.showMoreHistory = false;
        }
    }
    showorderMore(type) {
        if (type === 'today') {
            this.todayordervisitDetails = this.todayorderVisitDetailsArray;
            this.showMoreorderToday = true;
        } else if (type === 'future') {
            this.futureordervisitDetails = this.futureorderVisitDetailsArray;
            this.showMoreorderFuture = true;
        } else {
            this.historyOrdervisitDetails = this.historyorderVisitDetailsArray;
            this.showMoreOrderHistory = true;
        }
    }
    showorderLess(type) {
        if (type === 'today') {
            this.todayordervisitDetails = this.todayorderVisitDetailsArray.slice(0, 5);
            this.showMoreorderToday = false;
        } else if (type === 'future') {
            this.futureordervisitDetails = this.futureorderVisitDetailsArray.slice(0, 5);
            this.showMoreorderFuture = false;
        } else {
            this.historyOrdervisitDetails = this.historyorderVisitDetailsArray.slice(0, 5);
            this.showMoreOrderHistory = false;
        }
    }
    getSingleTime(slot) {
        const slots = slot.split('-');
        return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
    showHistory() {
        this.showMoreHistory = !this.showMoreHistory;
    }
    getCustomerQnr() {
        this.questionnaireList = [];
        this.provider_services.getCustomerQuestionnaire().subscribe(data => {
            this.questionnaireList = data;
        });
    }
    showQnr() {
        this.showQuestionnaire = !this.showQuestionnaire;
    }
    editCustomerDetails() {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit', id: this.customer[0].id }
        };
        this.router.navigate(['/provider/customers/create'], navigationExtras);
    }
    actionPerformed(event) {
        console.log(event);
        if (event.type === 'details') {
            this.gotoCustomerDetail(event.record, event.timeType);
        } else if (event.type === 'more') {
            if (event.heading === 'Today') {
                this.showMore('today');
            } else if (event.heading === 'Future') {
                this.showMore('future');
            } else if (event.heading === 'Todays Order') {
                this.showorderMore('today');
            } else if (event.heading === 'Future Order') {
                this.showorderMore('future');
            } else if (event.heading === 'Order History') {
                this.showorderMore('history');
            } else {
                this.showMore('history');
            }
        } else if (event.type === 'less') {
            if (event.heading === 'Today') {
                this.showLess('today');
            } else if (event.heading === 'Future') {
                this.showLess('future');
            } else if (event.heading === 'Todays Order') {
                this.showorderLess('today');
            } else if (event.heading === 'Future Order') {
                this.showorderLess('future');
            } else if (event.heading === 'Order History') {
                this.showorderLess('history');
            } else {
                this.showLess('history');
            }
        }
    }
    getConsumerBills() {
        const filter = { 'providerConsumer-eq': this.customer[0].id };
        this.provider_services.getProviderBills(filter).subscribe(data => {
            this.consumerBills = data;
        })
    }
}
