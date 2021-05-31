import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../constants/project-messages';
import { LocalStorageService } from '../../services/local-storage.service';
import { WordProcessor } from '../../services/word-processor.service';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { projectConstantsLocal } from '../../constants/project-constants';
import { GroupStorageService } from '../../services/group-storage.service';
import { Router } from '@angular/router';
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
    // @Input() pos;
    @Input() statusAction;
    service: any;
    user: any;
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
    newTimeDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
    customer_label = '';
    selectedUser;
    selQIds: any = [];
    constructor(
        private lStorageService: LocalStorageService,
        private wordProcessor: WordProcessor,
        private datePipe: DateFormatPipe,
        private dateTimeProcessor: DateTimeProcessor,
        private groupService: GroupStorageService,
        private router: Router,
        private cdref: ChangeDetectorRef) {
        this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    }

    ngOnInit() {
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
            this.router.navigate(['provider', 'appointments', this.waitlist.uid], { queryParams: { timetype: this.time_type } });
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
}
