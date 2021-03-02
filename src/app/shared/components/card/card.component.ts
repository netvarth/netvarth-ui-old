import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../constants/project-messages';
import { LocalStorageService } from '../../services/local-storage.service';
import { WordProcessor } from '../../services/word-processor.service';
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
    @Output() actionPerformed = new EventEmitter<any>();
    @Output() noteClicked = new EventEmitter<any>();
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
    constructor(private sharedFunctons: SharedFunctions,
        private lStorageService: LocalStorageService,
        private wordProcessor: WordProcessor,
        private cdref: ChangeDetectorRef) {
        this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    }

    ngOnInit() {
      console.log(this.item.type);

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
                console.log(this.service);
                break;
            case 'donation':
                this.service = this.item.item;
                console.log(this.service);
                this.buttonCaption = 'Donate';
                break;
            case 'catalog':
                this.service = this.item.item;
                console.log(this.service);
                break;
            case 'item':
            console.log('item');
                this.service = this.item.item;
                break;
            case 'pitem':
                this.service = this.item.item;
                this.actions = this.extras;
                console.log(this.service);
                console.log(this.actions);
                break;
            case 'order-details-item':
                this.service = this.item.item;
                break;
            case 'item-head':
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
        return this.sharedFunctons.convertMinutesToHourMinute(min);
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
            return (this.sharedFunctons.formatDate(date, { 'rettype': 'monthname' }) + ', '
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
            return (this.sharedFunctons.formatDate(date, { 'rettype': 'monthname' }) + ', '
                + this.getSingleTime(time));
        }
    }
    getSingleTime(slot) {
        const slots = slot.split('-');
        return this.sharedFunctons.convert24HourtoAmPm(slots[0]);
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
            return JSON.parse(user.profilePicture)['url'];
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
    getServiceType(){
        if(this.service.serviceType && this.service.serviceType == 'physicalService') {
            return 'Physical Service';
        } 
        else if (this.service.serviceType && this.service.serviceType == 'virtualService'){
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
}
