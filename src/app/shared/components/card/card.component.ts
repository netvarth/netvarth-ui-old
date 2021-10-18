import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../constants/project-messages';
import { LocalStorageService } from '../../services/local-storage.service';
import { WordProcessor } from '../../services/word-processor.service';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { projectConstantsLocal } from '../../constants/project-constants';
import { GroupStorageService } from '../../services/group-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { SubSink } from 'subsink';
import { SharedServices } from '../../services/shared-services';
import { S3UrlProcessor } from '../../services/s3-url-processor.service';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
@Component({
    'selector': 'app-card',
    'templateUrl': './card.component.html',
    'styleUrls': ['./card.component.css']
})
export class CardComponent implements OnInit, OnChanges, AfterViewChecked {
    @Input() item;
    @Input() terminology;
    @Input() loc;
    @Input() extras;
    @Input() domain;
    @Output() actionPerformed = new EventEmitter<any>();
    @Output() noteClicked = new EventEmitter<any>();
    @Input() type;
    @Input() time_type;
    @Input() allLabels;
    @Input() checkins;
    @Input() theme;
    @Input() teams;
    // @Input() pos;
    @Input() statusAction;
    service: any;
    user: any;
    private subs = new SubSink();
    timingCaption: string;
    timings: string;
    server_date;
    buttonCaption = Messages.GET_TOKEN;
    waitinglineCap = Messages.WAITINGLINE;
    personsAheadText = '';
    itemQty = 0;
    actions: string;
    todayDate;
    waitlist;
    appointment;
    newTimeDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
    customer_label = '';
    selectedUser;
    selQIds: any = [];
    qualification;
    sel_loc: any;
    locationName: any;
    googleMapUrl: any;
    sel_queue_id: any;
    from: string;
    change_date: any;
    futureAppt=false;
    account_id;
    provider_id: any;
    sel_checkindate: any;
    hold_sel_checkindate: any;
    selectedDate: any;
    tele_srv_stat: any;
    selectedDeptParam: number;
    selectedUserParam: any;
    rescheduleUserId: any;
    filterDepart = false;
    selectedService: number;
    customId: any;
    businessId: any;
    virtualInfo: any;
    waitlist_for: any = [];
    userPhone: any;
    countryCode: any;
    consumerNote = '';
    todaydate: any;
    isFuturedate = false;
    currentScheduleId: any;
    sel_ser: any;
    holdselectedTime: any;
    api_loading1 = true;
    servicesjson: any = [];
    serviceslist: any = [];
    sel_ser_det: any = [];
    callingModes: any = [];
    payEmail = '';
    showInputSection = false;
    questionnaireLoaded = false;
    newPhone;
    newEmail;
    newWhatsapp;
    virtualFields: any;
    changePhno = false;
    familymembers: any = [];
    callingModesDisplayName = projectConstants.CALLING_MODES;
    newMember: any;
    whatsappCountryCode: any;
    currentPhone: any;
    consumerType: string;
    questionnaireList: any = [];
    slots;
    freeSlots: any = [];
    availableSlots: any = [];
    showApptTime = false;
    apptTime = '';
    selectedApptTime = '';
    selected_dept: any;
    prepaymentAmount = 0;
    serviceCost: any;
    users: any = [];
    departments: any = [];
    availableDates: any = [];
    customer_data: any = [];
    appointmentSettings: any = [];
    heartfulnessAccount = false;
    settingsjson: any = [];
    futuredate_allowed = false;
    terminologiesjson: any = [];
    queuejson: any = [];
    businessjson: any = [];
    accountType: any;
    note_placeholder: string;
    note_cap = '';
    partysizejson: any = [];
    s3CouponsList: any = {
        JC: [], OWN: []
    };
    partySize = false;
    departmentlist: any = [];
    partySizeRequired = null;
    showCouponWB: boolean;
    maxsize: number;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    minDate;
    maxDate;
    today;
    ddate;
    step: number;
    constructor(
        private lStorageService: LocalStorageService,
        private wordProcessor: WordProcessor,
        private datePipe: DateFormatPipe,
        public shared_services: SharedServices,
        private s3Processor: S3UrlProcessor,
        private dateTimeProcessor: DateTimeProcessor,
        private groupService: GroupStorageService,
        private router: Router,
        public route: ActivatedRoute,
        private cdref: ChangeDetectorRef) {

            this.subs.sink = this.route.queryParams.subscribe(
                params => {
                    console.log("params..",params);
                    this.sel_loc = params.loc_id;
                    this.locationName = params.locname;
                    this.googleMapUrl = params.googleMapUrl;
                    if (params.qid) {
                        this.sel_queue_id = params.qid;
                    }
                    if(params.isFrom && params.isFrom =='providerdetail'){
                        this.from = 'providerdetail';
                    }
                    this.change_date = params.cur;
                    this.futureAppt = params.futureAppt;
                    this.account_id = params.account_id;
                    this.provider_id = params.unique_id;
                    this.sel_checkindate = this.selectedDate = params.sel_date;
                    this.hold_sel_checkindate = this.sel_checkindate;
                    this.tele_srv_stat = params.tel_serv_stat;
                    if (params.dept) {
                        this.selectedDeptParam = parseInt(params.dept);
                        this.filterDepart = true;
                    }
                    if (params.user) {
                        this.selectedUserParam = params.user;
                    }
                    if (params.service_id) {
                        this.selectedService = parseInt(params.service_id);
                    }
                    if (params.type === 'reschedule') {
                        this.type = params.type;
                        this.rescheduleUserId = params.uuid;
                        this.getRescheduleApptDet();
                    }
                    if (params.theme) {
                        this.theme = params.theme;
    
                    }
                    if (params.customId) {
                        this.customId = params.customId;
                        this.businessId = this.account_id;
                    }
                    if (params.virtual_info) {
                        this.virtualInfo = JSON.parse(params.virtual_info);
    
                    }
                });


    }
    gets3curl() {
        console.log('entered')
        this.api_loading1 = true;
        let accountS3List = 'settings,terminologies,coupon,providerCoupon,businessProfile,departmentProviders,appointmentsettings';
        console.log("provider id",this.provider_id)
        this.subs.sink = this.s3Processor.getJsonsbyTypes(this.provider_id,
            null, accountS3List).subscribe(
        
                (accountS3s) => {
                    console.log('checking accounts3list',accountS3List)
                    if (accountS3s['settings']) {
                        this.processS3s('settings', accountS3s['settings']);
                    }
                    if (accountS3s['appointmentsettings']) {
                        this.processS3s('appointmentsettings', accountS3s['appointmentsettings']);
                    }
                    if (accountS3s['terminologies']) {
                        this.processS3s('terminologies', accountS3s['terminologies']);
                    }
                    if (accountS3s['coupon']) {
                        this.processS3s('coupon', accountS3s['coupon']);
                    }
                    if (accountS3s['providerCoupon']) {
                        this.processS3s('providerCoupon', accountS3s['providerCoupon']);
                    }
                    if (accountS3s['departmentProviders']) {
                        this.processS3s('departmentProviders', accountS3s['departmentProviders']);
                    }
                    if (accountS3s['businessProfile']) {
                        this.processS3s('businessProfile', accountS3s['businessProfile']);
                    }
                    this.api_loading1 = false;
                console.log("accounts3list",accountS3List);

                }
                
            );
    }
    dateClass(date: Date): MatCalendarCellCssClasses {
        return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
    }
    handleFutureDateChange(e) {
        const tdate = e.targetElement.value;
        const newdate = tdate.split('/').reverse().join('-');
        const futrDte = new Date(newdate);
        const obtmonth = (futrDte.getMonth() + 1);
        let cmonth = '' + obtmonth;
        if (obtmonth < 10) {
            cmonth = '0' + obtmonth;
        }
        const seldate = futrDte.getFullYear() + '-' + cmonth + '-' + futrDte.getDate();
        this.sel_checkindate = seldate;
        this.getAvailableSlotByLocationandService(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
    }
    processS3s(type, res) {
        let result = this.s3Processor.getJson(res);
        switch (type) {
            case 'settings': {
                this.settingsjson = result;
                this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
                break;
            }
            case 'appointmentsettings': {
                this.appointmentSettings = result;
                console.log("appointment data...........",this.appointmentSettings)
                break;
            }
            case 'terminologies': {
                this.terminologiesjson = result;
                this.wordProcessor.setTerminologies(this.terminologiesjson);
                break;
            }
            case 'businessProfile': {
                this.businessjson = result;
                if (this.businessjson.uniqueId === 128007) {
                    this.heartfulnessAccount = true;
                }
                this.accountType = this.businessjson.accountType;
                if (this.accountType === 'BRANCH') {
                    this.getProviderDepart(this.businessjson.id);
                }
                this.domain = this.businessjson.serviceSector.domain;
                if (this.domain === 'foodJoints') {
                    this.note_placeholder = 'Item No Item Name Item Quantity';
                    this.note_cap = 'Add Note / Delivery address';
                } else {
                    this.note_placeholder = '';
                    this.note_cap = 'Add Note';
                }
                this.getPartysizeDetails(this.businessjson.serviceSector.domain, this.businessjson.serviceSubSector.subDomain);
                break;
            }
            case 'coupon': {
                this.s3CouponsList.JC = result;
                if (this.s3CouponsList.JC.length > 0) {
                    this.showCouponWB = true;
                }
                break;
            }
            case 'providerCoupon': {
                this.s3CouponsList.OWN = result;
                if (this.s3CouponsList.OWN.length > 0) {
                    this.showCouponWB = true;
                }
                break;
            }
            case 'departmentProviders': {
                let deptProviders: any = [];
                deptProviders = result;
                if (!this.filterDepart) {
                    this.users = deptProviders;
                } else {
                    deptProviders.forEach(depts => {
                        if (depts.users.length > 0) {
                            this.users = this.users.concat(depts.users);
                        }
                    });
                }
                if (this.selectedUserParam) {
                    this.setUserDetails(this.selectedUserParam);
                }
                break;
            }
        }
    }
    getPartysizeDetails(domain, subdomain) {
        this.subs.sink = this.shared_services.getPartysizeDetails(domain, subdomain)
            .subscribe(data => {
                this.partysizejson = data;
                this.partySize = false;
                this.maxsize = 1;
                if (this.partysizejson.partySize) {
                    this.partySize = true;
                    this.maxsize = (this.partysizejson.maxPartySize) ? this.partysizejson.maxPartySize : 1;
                }
                if (this.partySize && !this.partysizejson.partySizeForCalculation) { // check whether partysize box is to be displayed to the user
                    this.partySizeRequired = true;
                }
            },
                () => {
                });
    }
    getProviderDepart(id) {
        this.subs.sink = this.shared_services.getProviderDept(id).
            subscribe(data => {
                this.departmentlist = data;
                this.filterDepart = this.departmentlist.filterByDept;
                for (let i = 0; i < this.departmentlist['departments'].length; i++) {
                    if (this.departmentlist['departments'][i].departmentStatus !== 'INACTIVE') {
                        this.departments.push(this.departmentlist['departments'][i]);
                        if (this.selectedDeptParam && this.selectedDeptParam === this.departmentlist['departments'][i].departmentId) {
                            this.selected_dept = this.departmentlist['departments'][i];
                        }
                    }
                }
                if (!this.selectedDeptParam) {
                    this.selected_dept = this.departments[0];
                }
            });
    }

    getRescheduleApptDet() {
        this.subs.sink = this.shared_services.getAppointmentByConsumerUUID(this.rescheduleUserId, this.account_id).subscribe(
            (appt: any) => {
                this.appointment = appt;
                if (this.type === 'reschedule') {
                    this.waitlist_for.push({ id: this.appointment.appmtFor[0].id, firstName: this.appointment.appmtFor[0].firstName, lastName: this.appointment.appmtFor[0].lastName, phoneNo: this.appointment.phoneNumber });
                    this.userPhone = this.appointment.phoneNumber;
                    this.countryCode = this.appointment.countryCode;
                    this.consumerNote = this.appointment.consumerNote;

                }
                this.sel_loc = this.appointment.location.id;
                this.selectedService = this.appointment.service.id;
                this.sel_checkindate = this.selectedDate = this.hold_sel_checkindate = this.appointment.appmtDate;
                if (this.sel_checkindate !== this.todaydate) {
                    this.isFuturedate = true;
                }
                this.currentScheduleId = this.appointment.schedule.id;
                this.sel_ser = this.appointment.service.id;
                this.holdselectedTime = this.appointment.appmtTime;
                this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
                this.getSchedulesbyLocationandServiceIdavailability(this.sel_loc, this.selectedService, this.account_id);
            });
    }
    calculateDate(days) {
        const dte = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const date = moment(dte, 'YYYY-MM-DD HH:mm').format();
        const newdate = new Date(date);
        newdate.setDate(newdate.getDate() + days);
        const dd = newdate.getDate();
        const mm = newdate.getMonth() + 1;
        const y = newdate.getFullYear();
        const ndate1 = y + '-' + mm + '-' + dd;
        const ndate = moment(ndate1, 'YYYY-MM-DD HH:mm').format();
        const strtDt1 = this.todaydate + ' 00:00:00';
        const strtDt = moment(strtDt1, 'YYYY-MM-DD HH:mm').toDate();
        const nDt = new Date(ndate);
        if (nDt.getTime() >= strtDt.getTime()) {
            this.sel_checkindate = ndate;
            this.getAvailableSlotByLocationandService(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
        }
        const day1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const day = moment(day1, 'YYYY-MM-DD HH:mm').format();
        const ddd = new Date(day);
        this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
    }

    getServicebyLocationId(locid, pdate) {
        this.api_loading1 = true;
        this.subs.sink = this.shared_services.getServicesforAppontmntByLocationId(locid)
            .subscribe(data => {
                this.servicesjson = data;
                this.serviceslist = this.servicesjson;
                this.sel_ser_det = [];
                if (this.selectedService) {
                    this.sel_ser = this.selectedService;
                } else {
                    if (this.servicesjson.length > 0) {
                        this.sel_ser = this.servicesjson[0].id; // set the first service id to the holding variable
                    }
                }
                if (this.sel_ser) {
                    this.setServiceDetails(this.sel_ser);
                    this.getAvailableSlotByLocationandService(locid, this.sel_ser, pdate, this.account_id, 'init');
                    if (this.type != 'reschedule') {
                        this.getConsumerQuestionnaire();
                    } else {
                        this.questionnaireLoaded = true;
                        if (this.sel_ser_det.serviceType === 'virtualService') {
                            this.setVirtualTeleserviceCustomer();
                        }
                    }
                }
                this.api_loading1 = false;
            },
                () => {
                    this.api_loading1 = false;
                    this.sel_ser = '';
                });
    }
    setVirtualTeleserviceCustomer() {
        if (this.virtualInfo && this.virtualInfo.email && this.virtualInfo.email !== '') {
            // this.payEmail = this.virtualInfo.email;
            this.newEmail = this.payEmail = this.virtualInfo.email;

        }
        if (this.virtualInfo && this.virtualInfo.newMemberId) {
            this.waitlist_for = [];
            this.newMember = this.virtualInfo.newMemberId;
            this.virtualInfo.serviceFor = this.virtualInfo.newMemberId;
            const current_member = this.familymembers.filter(member => member.userProfile.id === this.newMember);
            this.waitlist_for.push({ id: this.newMember, firstName: current_member[0]['userProfile'].firstName, lastName: current_member[0]['userProfile'].lastName });
            if (this.virtualInfo.countryCode_whtsap && this.virtualInfo.whatsappnumber !== '' && this.virtualInfo.countryCode_whtsap !== undefined && this.virtualInfo.whatsappnumber !== undefined) {
                this.whatsappCountryCode = this.virtualInfo.countryCode_whtsap;
                this.newWhatsapp = this.virtualInfo.whatsappnumber
                if (this.virtualInfo.countryCode_whtsap.includes('+')) {
                    this.callingModes = this.virtualInfo.countryCode_whtsap.split('+')[1] + '' + this.virtualInfo.whatsappnumber;

                } else {
                    this.callingModes = this.virtualInfo.countryCode_whtsap + '' + this.virtualInfo.whatsappnumber;

                }
                this.currentPhone = this.virtualInfo.phoneno;
                this.userPhone = this.virtualInfo.phoneno;
                this.changePhno = true;
            }

        } if (this.virtualInfo && this.virtualInfo.serviceFor) {

            this.consumerType = 'member';
            this.waitlist_for = [];
            const current_member = this.familymembers.filter(member => member.userProfile.id === this.virtualInfo.serviceFor);
            this.waitlist_for.push({ id: this.virtualInfo.serviceFor, firstName: current_member[0]['userProfile'].firstName, lastName: current_member[0]['userProfile'].lastName });
            if (this.virtualInfo.countryCode_whtsap && this.virtualInfo.whatsappnumber !== '' && this.virtualInfo.countryCode_whtsap !== undefined && this.virtualInfo.whatsappnumber !== undefined) {
                this.whatsappCountryCode = this.virtualInfo.countryCode_whtsap;
                this.newWhatsapp = this.virtualInfo.whatsappnumber
                if (this.virtualInfo.countryCode_whtsap.includes('+')) {
                    this.callingModes = this.virtualInfo.countryCode_whtsap.split('+')[1] + '' + this.virtualInfo.whatsappnumber;
                } else {
                    this.callingModes = this.virtualInfo.countryCode_whtsap + ' ' + this.virtualInfo.whatsappnumber;

                }
                this.currentPhone = this.virtualInfo.phoneno;
                this.userPhone = this.virtualInfo.phoneno;
                this.changePhno = true;
            }

        }


    }
    getConsumerQuestionnaire() {
        const consumerid = (this.waitlist_for[0].id === this.customer_data.id) ? 0 : this.waitlist_for[0].id;
        this.shared_services.getConsumerQuestionnaire(this.sel_ser, consumerid, this.account_id).subscribe(data => {
            this.questionnaireList = data;
            this.questionnaireLoaded = true;
            if (this.sel_ser_det.serviceType === 'virtualService') {
                this.setVirtualTeleserviceCustomer();
            }
        });
    }

    getAvailableSlotByLocationandService(locid, servid, pdate, accountid, type?) {
        this.subs.sink = this.shared_services.getSlotsByLocationServiceandDate(locid, servid, pdate, accountid)
            .subscribe(data => {
                this.slots = data;
                this.freeSlots = [];
                for (const scheduleSlots of this.slots) {
                    this.availableSlots = scheduleSlots.availableSlots;
                    for (const freslot of this.availableSlots) {
                        if ((freslot.noOfAvailbleSlots !== '0' && freslot.active) || (freslot.time === this.appointment.appmtTime && scheduleSlots['date'] === this.sel_checkindate)) {
                            freslot['scheduleId'] = scheduleSlots['scheduleId'];
                            freslot['displayTime'] = this.getSingleTime(freslot.time);
                            this.freeSlots.push(freslot);
                            console.log("freeslots...........",this.freeSlots);
                        }
                    }
                }
                if (this.freeSlots.length > 0) {
                    this.showApptTime = true;
                    if (this.appointment && this.appointment.appmtTime && this.sel_checkindate === this.selectedDate) {
                        const appttime = this.freeSlots.filter(slot => slot.time === this.appointment.appmtTime);
                        this.apptTime = appttime[0];
                    } else {
                        this.apptTime = this.freeSlots[0];
                    }
                    this.waitlist_for[0].apptTime = this.apptTime['time'];
                } else {
                    this.showApptTime = false;
                }
                if (type) {
                    this.selectedApptTime = this.apptTime;
                    console.log("fdgfd"+JSON.stringify(this.selectedApptTime));
                }
                this.api_loading1 = false;
            });
    }
    setServiceDetails(curservid) {
        let serv;
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].id === curservid) {
                serv = this.servicesjson[i];
                if (serv.virtualCallingModes) {
                    if (serv.virtualCallingModes[0].callingMode === 'WhatsApp' || serv.virtualCallingModes[0].callingMode === 'Phone') {
                        if (this.type === 'reschedule') {
                            if (serv.virtualCallingModes[0].callingMode === 'WhatsApp') {
                                this.callingModes = this.appointment.virtualService['WhatsApp'];
                            } else {
                                this.callingModes = this.appointment.virtualService['Phone'];
                            }
                            const phNumber = this.appointment.countryCode + this.appointment.phoneNumber;
                            const callMode = '+' + serv.virtualCallingModes[0].value;
                            if (callMode === phNumber) {
                                this.changePhno = false;
                            } else {
                                this.changePhno = true;
                                this.currentPhone = this.appointment.phoneNumber;
                            }
                        } else {
                            const unChangedPhnoCountryCode = this.countryCode.split('+')[1];
                            this.callingModes = unChangedPhnoCountryCode + '' + this.customer_data.primaryPhoneNumber;
                            if (serv.serviceType === 'virtualService' && this.virtualInfo) {
                                if (this.virtualInfo.countryCode_whtsap && this.virtualInfo.whatsappnumber !== '' && this.virtualInfo.countryCode_whtsap !== undefined && this.virtualInfo.whatsappnumber !== undefined) {
                                    const whtsappcountryCode = this.virtualInfo.countryCode_whtsap.split('+')[1];
                                    this.callingModes = whtsappcountryCode + '' + this.virtualInfo.whatsappnumber;

                                }
                            }
                        }
                    }
                }
                break;
            }
        }
        this.sel_ser_det = [];
        this.selectedUser = null;
        this.selected_dept = null;
        this.selectedUserParam = null;
        this.selectedDeptParam = null;
        if (serv.provider) {
            this.selectedUserParam = serv.provider.id;
            this.setUserDetails(this.selectedUserParam);
        }
        if (this.filterDepart) {
            this.selectedDeptParam = serv.department;
            this.getDepartmentById(this.selectedDeptParam);
        }
        this.sel_ser = serv.id;
        this.sel_ser_det = {
            name: serv.name,
            duration: serv.serviceDuration,
            description: serv.description,
            livetrack: serv.livetrack,
            price: serv.totalAmount,
            isPrePayment: serv.isPrePayment,
            minPrePaymentAmount: serv.minPrePaymentAmount,
            status: serv.status,
            taxable: serv.taxable,
            serviceType: serv.serviceType,
            virtualServiceType: serv.virtualServiceType,
            virtualCallingModes: serv.virtualCallingModes,
            postInfoEnabled: serv.postInfoEnabled,
            postInfoText: serv.postInfoText,
            postInfoTitle: serv.postInfoTitle,
            preInfoEnabled: serv.preInfoEnabled,
            preInfoTitle: serv.preInfoTitle,
            preInfoText: serv.preInfoText,
            consumerNoteMandatory: serv.consumerNoteMandatory,
            consumerNoteTitle: serv.consumerNoteTitle
        };
        if (serv.provider) {
            this.sel_ser_det.provider = serv.provider;
        }
        if (serv.provider) {
            this.sel_ser_det['providerId'] = serv.provider.id;
        }
        this.prepaymentAmount = this.waitlist_for.length * this.sel_ser_det.minPrePaymentAmount || 0;
        this.serviceCost = this.sel_ser_det.price;
    }
    setUserDetails(selectedUserId) {
        const userDetail = this.users.filter(user => user.id === selectedUserId);
        this.selectedUser = userDetail[0];
    }
    getDepartmentById(deptId) {
        for (let i = 0; i < this.departments.length; i++) {
            if (deptId === this.departments[i].departmentId) {
                this.selected_dept = this.departments[i];
                break;
            }
        }
    }
    getSchedulesbyLocationandServiceIdavailability(locid, servid, accountid) {
        const _this = this;
        if (locid && servid && accountid) {
            _this.subs.sink = _this.shared_services.getAvailableDatessByLocationService(locid, servid, accountid)
                .subscribe((data: any) => {
                    const availables = data.filter(obj => obj.availableSlots);
                    const availDates = availables.map(function (a) { return a.date; });
                    _this.availableDates = availDates.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                    });
                });
        }
    }

    disableMinus() {
        const seldate1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const seldate2 = moment(seldate1, 'YYYY-MM-DD HH:mm').format();
        const seldate = new Date(seldate2);
        const selecttdate = new Date(seldate.getFullYear() + '-' + this.dateTimeProcessor.addZero(seldate.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(seldate.getDate()));
        const strtDt1 = this.hold_sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const strtDt2 = moment(strtDt1, 'YYYY-MM-DD HH:mm').format();
        const strtDt = new Date(strtDt2);
        const startdate = new Date(strtDt.getFullYear() + '-' + this.dateTimeProcessor.addZero(strtDt.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(strtDt.getDate()));
        if (startdate >= selecttdate) {
            return true;
        } else {
            return false;
        }
    }






    ngOnInit() {
        this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
        this.maxsize = 1;
        this.step = 1;
        this.gets3curl();
        if (this.server_date) {
            this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        }
        this.today = new Date(this.today);
        this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        this.minDate = new Date(this.minDate);
        const dd = this.today.getDate();
        const mm = this.today.getMonth() + 1; // January is 0!
        const yyyy = this.today.getFullYear();
        let cday = '';
        if (dd < 10) {
            cday = '0' + dd;
        } else {
            cday = '' + dd;
        }
        let cmon;
        if (mm < 10) {
            cmon = '0' + mm;
        } else {
            cmon = '' + mm;
        }
        const dtoday = yyyy + '-' + cmon + '-' + cday;
        this.todaydate = dtoday;
        this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
        if (this.type !== 'reschedule') {
            this.waitlist_for.push({ id: this.customer_data.id, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName });
        }
        this.minDate = this.todaydate;
        if (this.change_date === 'true') {
            const seldateChecker = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
            const seldate_checker = new Date(seldateChecker);
            const todaydateChecker = new Date(this.todaydate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
            const todaydate_checker = new Date(todaydateChecker);
            if (seldate_checker.getTime() === todaydate_checker.getTime()) { // if the next available date is today itself, then add 1 day to the date and use it
                const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
                const serverdate = moment(server).format();
                const servdate = new Date(serverdate);
                const nextdate = new Date(seldate_checker.setDate(servdate.getDate() + 1));
                this.sel_checkindate = this.selectedDate = nextdate.getFullYear() + '-' + (nextdate.getMonth() + 1) + '-' + nextdate.getDate();
            }
        }
        const day = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const ddd = new Date(day);
        this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
        this.hold_sel_checkindate = this.sel_checkindate;       
        console.log(this.item)
        console.log(this.type)
        console.log(this.teams);
        if(this.type == 'appointment-dashboard'){
            this.appointment = this.item;
            console.log(this.appointment)
        }
        if (this.type) {
            this.item.type = this.type;
        }
        if (this.item.type == 'checkin-dashboard') {
            if (this.groupService.getitemFromGroupStorage('selectedUser')) {
                this.selectedUser = this.groupService.getitemFromGroupStorage('selectedUser');
            }
            if (this.time_type === 2 && this.groupService.getitemFromGroupStorage('future_selQ')) {
                this.selQIds = this.groupService.getitemFromGroupStorage('future_selQ');
            } else if (this.time_type === 1 && this.groupService.getitemFromGroupStorage('selQ')) {
                this.selQIds = this.groupService.getitemFromGroupStorage('selQ');
            } else if (this.time_type === 3 && this.groupService.getitemFromGroupStorage('history_selQ')) {
                this.selQIds = this.groupService.getitemFromGroupStorage('history_selQ');
            }
        } else {
            if (this.groupService.getitemFromGroupStorage('appt-selectedUser')) {
                this.selectedUser = this.groupService.getitemFromGroupStorage('appt-selectedUser');
            }
            if (this.time_type === 2 && this.groupService.getitemFromGroupStorage('appt_future_selQ')) {
                this.selQIds = this.groupService.getitemFromGroupStorage('appt_future_selQ');
            } else if (this.time_type === 1 && this.groupService.getitemFromGroupStorage('appt_selQ')) {
                this.selQIds = this.groupService.getitemFromGroupStorage('appt_selQ');
            } else if (this.time_type === 3 && this.groupService.getitemFromGroupStorage('appt_history_selQ')) {
                this.selQIds = this.groupService.getitemFromGroupStorage('appt_history_selQ');
            }
        }
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.todayDate = this.datePipe.transformTofilterDate(new Date());
        switch (this.item.type) {
            case 'waitlist':
                this.service = this.item.item;
                this.personsAheadText = 'People in line : ' + this.service.serviceAvailability['personAhead'];
                if (this.service.serviceAvailability['showToken']) {
                } else {
                    this.buttonCaption = 'Get ' + this.getTerminologyTerm('waitlist');
                }
                if (this.service.serviceAvailability['calculationMode'] !== 'NoCalc') {
                    if (this.service.serviceAvailability['serviceTime']) {
                        this.timingCaption = 'Next Available Time';
                        this.timings = this.getAvailibilityForCheckin(this.service.serviceAvailability['availableDate'], this.service.serviceAvailability['serviceTime']);
                    } else {
                        this.timingCaption = 'Est Wait Time';
                        this.timings = this.getTimeToDisplay(this.service.serviceAvailability['queueWaitingTime']);
                    }
                }
                break;
            case 'appt':
                this.service = this.item.item;
                this.timingCaption = 'Next Available Time';
                this.timings = this.getAvailabilityforAppt(this.service.serviceAvailability.nextAvailableDate, this.service.serviceAvailability.nextAvailable);
                this.buttonCaption = 'Get Appointment';
                break;
            case 'donation':
                this.service = this.item.item;
                this.buttonCaption = 'Donate';
                break;
            case 'catalog':
                this.service = this.item.item;
                break;
            case 'item':
                this.service = this.item.item;
                break;
            case 'pitem':
                this.service = this.item.item;
                this.actions = this.extras;
                break;
            case 'order-details-item':
                this.service = this.item.item;
                break;
            case 'item-head':
                break;
            case 'checkin-dashboard':
                this.waitlist = this.item;
                break;
            case 'appt-dashboard':
                this.waitlist = this.item;
                break;
            default:
                this.user = this.item.item;
                break;
        }
    }
    ngOnChanges() {
        // this.itemQty = this.quantity;
        // this.cdref.detectChanges();
        // console.log(this.extras);
    }
    ngAfterViewChecked() {
        this.cdref.detectChanges();
    }
    getItemQty(itemObj) {
        const item = itemObj.item;
        const orderList = this.extras;
        let qty = 0;
        if (orderList !== null && orderList.filter(i => i.item.itemId === item.itemId)) {
            qty = orderList.filter(i => i.item.itemId === item.itemId).length;
        }
        return qty;
    }
    stopProp(event) {
        event.stopPropagation();
    }
    cardActionPerformed(type, action, service, location, userId, event) {
        console.log("type..",type,'view',action);
        event.stopPropagation();
        const actionObj = {};
        actionObj['type'] = type;
        actionObj['action'] = action;
        if (service) {
            actionObj['service'] = service;
        }
        if (location) {
            actionObj['location'] = location;
        }
        if (userId) {
            actionObj['userId'] = userId;
        }
        this.actionPerformed.emit(actionObj);
    }
    showConsumerNote(item) {
        this.noteClicked.emit(item);
    }
    getTerminologyTerm(term) {
        const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
        if (this.terminology) {
            return this.wordProcessor.firstToUpper((this.terminology[term_only]) ? this.terminology[term_only] : ((term === term_only) ? term_only : term));
        } else {
            return this.wordProcessor.firstToUpper((term === term_only) ? term_only : term);
        }
    }
    getTimeToDisplay(min) {
        return this.dateTimeProcessor.convertMinutesToHourMinute(min);
    }
    getAvailibilityForCheckin(date, serviceTime) {
        const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const today = new Date(todaydt);
        const dd = today.getDate();
        const mm = today.getMonth() + 1; // January is 0!
        const yyyy = today.getFullYear();
        let cday = '';
        if (dd < 10) {
            cday = '0' + dd;
        } else {
            cday = '' + dd;
        }
        let cmon;
        if (mm < 10) {
            cmon = '0' + mm;
        } else {
            cmon = '' + mm;
        }
        const dtoday = yyyy + '-' + cmon + '-' + cday;
        if (dtoday === date) {
            return ('Today' + ', ' + serviceTime);
        } else {
            return (this.dateTimeProcessor.formatDate(date, { 'rettype': 'monthname' }) + ', '
                + serviceTime);
        }
    }
    getAvailabilityforAppt(date, time) {
        const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const today = new Date(todaydt);
        const dd = today.getDate();
        const mm = today.getMonth() + 1; // January is 0!
        const yyyy = today.getFullYear();
        let cday = '';
        if (dd < 10) {
            cday = '0' + dd;
        } else {
            cday = '' + dd;
        }
        let cmon;
        if (mm < 10) {
            cmon = '0' + mm;
        } else {
            cmon = '' + mm;
        }
        const dtoday = yyyy + '-' + cmon + '-' + cday;
        if (dtoday === date) {
            return ('Today' + ', ' + this.getSingleTime(time));
        } else {
            return (this.dateTimeProcessor.formatDate(date, { 'rettype': 'monthname' }) + ', '
                + this.getSingleTime(time));
        }
    }
    getSingleTime(slot) {
        const slots = slot.split('-');
        return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
    getAvailableSlot(slots) {
        let slotAvailable = '';
        for (let i = 0; i < slots.length; i++) {
            if (slots[i].active) {
                slotAvailable = this.getSingleTime(slots[i].time);
                break;
            }
        }
        return slotAvailable;
    }
    getPic(user) {
        if (user.profilePicture) {
            // alert(JSON.parse(user.profilePicture)['url']);
            return user.profilePicture['url'];
        }
        return 'assets/images/img-null.svg';
    }
    getItemImg(item) {
        if (item.itemImages) {
            const img = item.itemImages.filter(image => image.displayImage);
            if (img[0]) {
                return img[0].url;
            } else {
                return '../../../../assets/images/order/Items.svg';
            }
        } else {
            return '../../../../assets/images/order/Items.svg';
        }
    }
    getServiceType() {
        if (this.service.serviceType && this.service.serviceType == 'physicalService') {
            return 'Physical Service';
        }
        else if (this.service.serviceType && this.service.serviceType == 'virtualService') {
            return 'Virtual Service';
        }
        else {
            /* if(this.service.virtualServiceType == 'videoService') {
                return this.service.virtualCallingModes[0].callingMode + " " + "Video";
            }
            else if(this.service.virtualServiceType == 'audioService') {
                return this.service.virtualCallingModes[0].callingMode + " " + "Audio";
            } */
            return ' ';
        }
    }
    /* openCard(id, event){
        event.stopPropagation();
        var cardElement = document.getElementById(id);
        if(cardElement.classList.contains('expand')){
            cardElement.classList.remove("expand");
        }
        else{
            cardElement.classList.add("expand");
        }
        return;
    } */
    getDisplayname(label) {
        for (let i = 0; i < this.allLabels.length; i++) {
            if (this.allLabels[i].label === label) {
                return this.allLabels[i].displayName;
            }
        }
    }
    getLabels(checkin) {
        let label = [];
        Object.keys(checkin.label).forEach(key => {
            for (let i = 0; i < this.allLabels.length; i++) {
                if (this.allLabels[i].label === key) {
                    label.push(this.allLabels[i].displayName);
                }
            }
        });
        const lbl = label.toString();
        return lbl.replace(/,/g, ", ");
    }
    checkinActions(waitlist, type) {
        this.actionPerformed.emit({ waitlist: waitlist, type: type, statusAction: this.statusAction });
    }
    gotoDetails() {
        if (this.item.type == 'checkin-dashboard') {
            this.router.navigate(['provider', 'check-ins', this.waitlist.ynwUuid], { queryParams: { timetype: this.time_type } });
        } else {
            this.router.navigate(['provider', 'appointments', this.appointment.uid], { queryParams: { timetype: this.time_type } });
        }
    }
    showMoreorLess(waitlist, type) {
        for (let checkin of this.checkins) {
            checkin.show = false;
        }
        if (type === 'more') {
            const index = this.checkins.indexOf(waitlist);
            this.checkins[index].show = true;
        }
    }
    showDetails(waitlist) {
        const currentcheckin = this.checkins.filter(checkin => checkin.ynwUuid === waitlist.ynwUuid);
        if (currentcheckin[0].show) {
            return true;
        } else {
            return false;
        }
    }
    getAge(age) {
        age = age.split(',');
        return age[0];
    }
    getScheduleIndex(id) {
        // const filterSchedule = this.activeSchedules.filter(sch => sch.id === id);
        // return this.activeSchedules.indexOf(filterSchedule[0]);
    }
    getUsersList(teamid){
       const userObject =  this.teams.filter(user => parseInt(user.id) === teamid); 
       return userObject[0].name;
    }
}
