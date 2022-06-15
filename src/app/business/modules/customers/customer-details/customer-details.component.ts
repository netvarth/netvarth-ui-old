import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from "../../../../business/services/provider-services.service";
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
import { CommunicationPopupComponent } from '../../bookings/communication-popup/communication-popup.component';
// import { interval as observableInterval } from 'rxjs';
import { SubSink } from 'subsink';
import { CommunicationService } from '../../../../business/services/communication-service';
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
    ordervisitDetails: any = [];
    OrdersvisitDetails: any = [];
    futureordervisitDetails: any = [];
    historyOrdervisitDetails: any = [];
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
    OrdersVisitDetailsArray: any = [];
    futureorderVisitDetailsArray: any = [];
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
    historyorderVisitDetailsArray: any = [];
    consumerBills: any = [];
    showQuestionnaire = false;
    subs = new SubSink();
    refreshTime = 10;
    linkStatus: any;
    meetingStatus: string;
    showEndBt: boolean;
    showRejoinBt: boolean;
    small_device_display = false;
    whatsappCountryCode: any;
    whatsappNumber: any;
    number: any;
    orderVisits: any = [];
    todayorderVisitDetailsArray: any = [];
    todayordervisitDetails: any;
    orderstatus: any;
    globalSettings: any;
    groupId;
    groupName : string;
    groupMemberId;
    constructor(
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute,
        private _location: Location, public dialog: MatDialog,
        private router: Router,
        private wordProcessor: WordProcessor,
        private communicationService: CommunicationService,
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
                                    this.groupId = this.customer[0].groups.substr(2,3)
                                    console.log("Customer Details :",this.customer[0].groups.substr(2,3))
                                    if(this.groupId){
                                    this.provider_services.getCustomerGroupById(this.groupId).subscribe((res : any)=>{
                                        console.log("getCustomerGroup ",res)
                                        this.groupName = res.groupName;
                                        console.log("getCustomerGroup Name", this.groupName)
                                        this.provider_services.getMemberId(this.groupName,this.customerId).subscribe((res : any)=>{
                                            this.groupMemberId = res;
                                            console.log("groupMemberId :",this.groupMemberId)
                                        })
                                    })
                                }
                                    
                                   
                                    console.log("Customer groups :",this.customer)
                                    this.customerName = this.customer[0].firstName;
                                    this.viewCustomer = true;
                                    this.loading = false;
                                    if (this.customerId) {
                                        this.getCustomerTodayVisit();
                                        this.getCustomerFutureVisit();
                                        this.getCustomerHistoryVisit();
                                        this.getCustomerOrderVisit();
                                        this.getOrderStatus();
                                        this.getGlobalSettings();
                                    }
                                }
                            );
                        }
                    );
                }
            }
        );
        localStorage.setItem('Detail', 'All');


       
       
    }
    // getCustomers(customerId) {
    //     const _this = this;
    //     const filter = { 'id-eq': customerId };
    //     return new Promise(function (resolve, reject) {
    //         _this.provider_services.getProviderCustomers(filter)
    //             .subscribe(
    //                 data => {
    //                     resolve(data);
    //                 },
    //                 () => {
    //                     reject();
    //                 }
    //             );
    //     });
    // }
    @HostListener('window:resize', ['$event'])
    onResize() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 767) {
            this.small_device_display = true;
        } else {
            this.small_device_display = false;
        }
    }
    getCustomers(customerId) {
        const _this = this;
        const filter = { 'id-eq': customerId };
        return new Promise(function (resolve, reject) {
            _this.provider_services.getProviderCustomers(filter)
                .subscribe(
                    (data: any) => {
                        if (data[0].whatsAppNum) {
                            _this.whatsappCountryCode = data[0].whatsAppNum.countryCode;
                            _this.whatsappNumber = data[0].whatsAppNum.number;
                        }
                        if (data[0].phoneNo && data[0].phoneNo.trim() !== '') {
                            _this.number = data[0].countryCode + ' ' + data[0].phoneNo;
                        }
                        _this.email = data[0].email;
                        resolve(data);
                    },
                    () => {
                        reject();
                    }
                );
        });
    }
    ngOnInit() {
        // this.getCustomerQnr();
    
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
                this.historyvisitDetails = data;
                this.loading = false;
                this.orderVisits = data;
            }
        );
        console.log("historyvisitDetails",this.historyvisitDetails)

    }
    getCustomerOrderVisit() {
        this.loading = true;
        this.provider_services.getCustomerOrderVisit(this.customerId).subscribe(
            (data: any) => {
                this.ordervisitDetails = data;
                this.todayorderVisitDetailsArray = this.todayordervisitDetails = data.todayOrders;
                // this.OrdersVisitDetailsArray = this.OrdersvisitDetails = data.todayOrders.concat(data.futureOrders,data.historyOrders);
                // console.log("Object.assign(data.todayOrders, data.futureOrders)",data.todayOrders.concat(data.futureOrders))
                // this.OrdersvisitDetails = this.OrdersVisitDetailsArray.slice(0, 5);
                this.futureorderVisitDetailsArray = this.futureordervisitDetails = data.futureOrders;
                // this.futureordervisitDetails = this.futureorderVisitDetailsArray.slice(0, 5);
                this.historyorderVisitDetailsArray = this.historyOrdervisitDetails = data.historyOrders;
                // this.historyOrdervisitDetails = this.historyorderVisitDetailsArray.slice(0, 5);
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
            this.router.navigate(['provider', 'check-ins', visit.waitlist.ynwUuid], { queryParams: { timetype: time_type } });
        } else if (visit.appointmnet) {
            this.router.navigate(['provider', 'appointments', visit.appointmnet.uid], { queryParams: { timetype: time_type } });
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
        }
    }
    showLess(type) {
        if (type === 'today') {
            this.todayvisitDetails = this.todayVisitDetailsArray.slice(0, 5);
            this.showMoreToday = false;
        } else if (type === 'future') {
            this.futurevisitDetails = this.futureVisitDetailsArray.slice(0, 5);
            this.showMoreFuture = false;
        }
    }
    showorderMore(type) {
        if (type === 'today') {
            this.todayordervisitDetails = this.todayorderVisitDetailsArray;
            // this.OrdersvisitDetails = this.OrdersVisitDetailsArray;
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
            // this.OrdersvisitDetails = this.OrdersVisitDetailsArray.slice(0, 5);
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

    getOrderStatus() {
        this.provider_services.getProviderOrderSettings().subscribe((data: any) => {
          this.orderstatus = data.enableOrder;
          console.log("OrderStatus : ",this.orderstatus);
        });
      }

      getGlobalSettings() {
        this.provider_services.getGlobalSettings().subscribe((data: any) => {
          this.globalSettings = data;
          console.log("Global Settings : ",this.globalSettings);
        });
      }

    actionPerformed(event) {
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

    gotoQnr() {
        this.router.navigate(['provider', 'customers', this.customer[0].id, 'questionnaires'], { queryParams: { uid: this.customer[0].id, source: 'customer-details' } });
    }


    showCommunications() {
        this.dialog.open(CommunicationPopupComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'newPopupClass'],
            disableClose: true,
            data: {
                whatsappCountryCode: this.whatsappCountryCode,
                whatsappNumber: this.whatsappNumber,
                number: this.number,
                customerId: this.customerId,
                email: this.email,
                type: 'customer'
            }
        });
    }

    CustomersInboxMessage() {
        this.communicationService.ConsumerInboxMessage(this.customerDetails, 'customer-list')
            .then(
                () => { },
                () => { }
            );
    }
}
