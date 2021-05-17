
import { interval as observableInterval, Subscription } from 'rxjs';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../app.component';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { AuthService } from '../../../shared/services/auth-service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';

@Component({
    selector: 'app-displayboard-content',
    templateUrl: './displayboard-content.component.html'
})

export class DisplayboardLayoutContentComponent implements OnInit, OnDestroy {
    layout_id;
    boardLayouts = [
        { displayName: '1x1', value: '1_1', row: 1, col: 1 },
        { displayName: '1x2', value: '1_2', row: 1, col: 2 },
        { displayName: '2x1', value: '2_1', row: 2, col: 1 },
        { displayName: '2x2', value: '2_2', row: 2, col: 2 }
    ];
    boardRows: any;
    boardCols: any;
    selectedDisplayboards: any = {};
    boardHeight;
    fullHeight;
    bname;
    blogo = '';
    metricElement;
    cronHandle: Subscription;
    MainBlogo;
    bProfile: any = [];
    qualification: any = [];
    subDomVirtualFields: any = [];
    accountType;
    MainBname;
    locId;
    provider_id;
    businessJson: any = [];
    type;
    refreshTime = projectConstants.INBOX_REFRESH_TIME;
    cronHandle1: Subscription;
    index;
    bProfiles: any = [];
    inputStatusboards: any = [];
    tabid: any = {};
    manageTabCalled = false;
    s3Url;
    showIndex = 0;
    api_loading = true;
    roomName = '';
    is_image: boolean;
    position: any;
    width: any;
    height: any;
    isContainer = false;
    qBoardTitle: any;
    qBoardFooter;
    qBoardGroupFooter: any;
    qBoardGroupTitle: any;
    bLogoWidth = '';
    bLogoHeight = '';
    gLogoWidth = '';
    gLogoHeight = '';
    glogo = '';
    gPosition;
    customer_label = '';
    constructor(private activated_route: ActivatedRoute,
        private provider_services: ProviderServices,
        public _sanitizer: DomSanitizer,
        public router: Router, private wordProcessor: WordProcessor,
        private lStorageService: LocalStorageService,
        private authService: AuthService,
        private dateTimeProcessor: DateTimeProcessor,
        private snackbarService: SnackbarService) {
        this.onResize();
        this.activated_route.params.subscribe(
            qparams => {
                this.layout_id = qparams.id;
            });
        this.activated_route.queryParams.subscribe(
            queryparams => {
                if (queryparams.type === 'wl') {
                    this.type = 'waitlist';
                } else {
                    this.type = 'appointment';
                }
            });
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    }
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        const screenHeight = window.innerHeight;
        let hgt_reduced = 200;
        let fullhgt_reduced = 165;
        if (this.isContainer) {
            hgt_reduced = 320;
            fullhgt_reduced = 270;
        }
        if (this.bLogoHeight === '') {
            hgt_reduced = 136;
            fullhgt_reduced = 86;
        }
        this.fullHeight = screenHeight - fullhgt_reduced;
        if (this.boardRows > 1) {
            this.boardHeight = (screenHeight - hgt_reduced) / 2;
        } else {
            this.boardHeight = (screenHeight - hgt_reduced);
        }
    }
    getSingleTime(slot) {
        const slots = slot.split('-');
        return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
    ngOnDestroy() {
        if (this.cronHandle) {
            this.cronHandle.unsubscribe();
        }
        if (this.cronHandle1) {
            this.cronHandle1.unsubscribe();
        }
    }
    ngOnInit() {
        this.authService.goThroughBusinessLogin().then(
            (userLoggedIn) => {
                if (userLoggedIn) {
                    this.lStorageService.removeitemfromLocalStorage('dB');
                    this.initBoard();
                } else {
                    this.lStorageService.setitemonLocalStorage('dB', this.router.url);
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            'src': 'dB'
                        }
                    };
                    this.router.navigate(['business', 'login'], navigationExtras);
                }

            }
        )
    }
    initBoard() {
        this.provider_services.getDisplayboardById_Type(this.layout_id, this.type).subscribe(
            (displayboard_data: any) => {
                if (displayboard_data.isContainer) {
                    this.inputStatusboards = displayboard_data.containerData;
                    this.showIndex = 0;
                    this.isContainer = true;
                    if (displayboard_data['headerSettings']) {
                        this.qBoardGroupTitle = displayboard_data['headerSettings']['title1'] || '';
                    }
                    if (displayboard_data['footerSettings']) {
                        this.qBoardGroupFooter = displayboard_data['footerSettings']['title1'] || '';
                    }
                    if (displayboard_data.logoSettings) {
                        if (displayboard_data.logoSettings.logo) {
                            this.is_image = true;
                            const logoObj = displayboard_data.logoSettings.logo;
                            this.glogo = logoObj['url'];
                        }
                        this.gPosition = displayboard_data.logoSettings['position'];
                        if (displayboard_data.logoSettings.height && displayboard_data.logoSettings.width) {
                            this.gLogoWidth = displayboard_data.logoSettings['width'];
                            this.gLogoHeight = displayboard_data.logoSettings['height'];
                        } else {
                            this.gLogoWidth = '100';
                            this.gLogoHeight = '100';
                        }
                    }
                    this.getStatusboard(this.inputStatusboards[this.showIndex]);
                    this.cronHandle = observableInterval(this.inputStatusboards[this.showIndex].sbInterval * 1000).subscribe(() => {
                        if (this.showIndex === (this.inputStatusboards.length - 1)) {
                            this.showIndex = 0;
                        } else {
                            ++this.showIndex;
                        }
                        this.getStatusboard(this.inputStatusboards[this.showIndex]);
                    });
                } else {
                    this.roomName = displayboard_data['serviceRoom'];
                    if (displayboard_data.headerSettings && displayboard_data.headerSettings['title1']) {
                        this.qBoardTitle = this._sanitizer.bypassSecurityTrustHtml(displayboard_data.headerSettings['title1']);
                    }
                    if (displayboard_data.footerSettings && displayboard_data.footerSettings['title1']) {
                        this.qBoardFooter = this._sanitizer.bypassSecurityTrustHtml(displayboard_data.footerSettings['title1']);
                    }
                    if (displayboard_data.logoSettings) {
                        if (displayboard_data.logoSettings.logo) {
                            this.is_image = true;
                            const logoObj = displayboard_data.logoSettings.logo;
                            this.blogo = logoObj['url'];
                        }
                        this.position = displayboard_data.logoSettings['position'];
                        if (displayboard_data.logoSettings.height && displayboard_data.logoSettings.width) {
                            this.bLogoWidth = displayboard_data.logoSettings['width'];
                            this.bLogoHeight = displayboard_data.logoSettings['height'];
                        } else {
                            this.bLogoWidth = '100';
                            this.bLogoHeight = '100';
                        }
                    }
                    const layoutPosition = displayboard_data.layout.split('_');
                    this.boardRows = layoutPosition[0];
                    this.onResize();
                    this.boardCols = layoutPosition[1];
                    displayboard_data.metric.forEach(element => {
                        this.metricElement = element;
                        this.selectedDisplayboards[element.position] = {};
                        this.setDisplayboards(this.metricElement);
                    });
                    this.cronHandle = observableInterval(10000).subscribe(() => {
                        displayboard_data.metric.forEach(element => {
                            this.metricElement = element;
                            this.selectedDisplayboards[element.position] = {};
                            this.setDisplayboards(this.metricElement);
                        });
                    });
                    this.api_loading = false;
                }
            },
            (error) => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.router.navigate(['/']);
            });
    }
    getStatusboard(boardObj) {
        if (boardObj.sbId) {
            this.roomName = '';
            this.api_loading = true;
            this.provider_services.getDisplayboardById_Type(boardObj.sbId, this.type).subscribe(
                (displayboard_data: any) => {
                    this.roomName = displayboard_data['serviceRoom'];
                    if (displayboard_data.headerSettings && displayboard_data.headerSettings['title1']) {
                        this.qBoardTitle = this._sanitizer.bypassSecurityTrustHtml(displayboard_data.headerSettings['title1']);
                    }
                    if (displayboard_data.footerSettings && displayboard_data.footerSettings['title1']) {
                        this.qBoardFooter = this._sanitizer.bypassSecurityTrustHtml(displayboard_data.footerSettings['title1']);
                    }
                    if (displayboard_data.logoSettings) {
                        if (displayboard_data.logoSettings.logo) {
                            this.is_image = true;
                            const logoObj = JSON.parse(displayboard_data.logoSettings.logo);
                            this.blogo = logoObj['url'];
                        }
                        this.position = displayboard_data.logoSettings['position'];
                        this.bLogoWidth = displayboard_data.logoSettings['width'];
                        this.bLogoHeight = displayboard_data.logoSettings['height'];
                    }
                    const layoutPosition = displayboard_data.layout.split('_');
                    this.boardRows = layoutPosition[0];
                    this.onResize();
                    this.boardCols = layoutPosition[1];
                    displayboard_data.metric.forEach(element => {
                        this.metricElement = element;
                        this.selectedDisplayboards[element.position] = {};
                        this.setDisplayboards(this.metricElement);
                    });
                    this.api_loading = false;
                });
        }
    }
    getFieldValue(field, checkin) {
        let fieldValue = '';
        if (field.name === 'waitlistingFor' || field.name === 'appmtFor') {
            let lastname = '';
            if (checkin[field.name][0].lastName) {
                const lastName = checkin[field.name][0].lastName;
                const nameLength = lastName.length;
                const encryptedName = [];
                for (let i = 0; i < nameLength; i++) {
                    encryptedName[i] = lastName[i].replace(/./g, '*');
                }
                for (let i = 0; i < nameLength; i++) {
                    lastname += encryptedName[i];
                }
            }
            fieldValue = (checkin[field.name][0].firstName) ? checkin[field.name][0].firstName : '' + ' ' + lastname;
            if (!checkin[field.name][0].firstName && lastname === '') {
                if (this.type === 'waitlist') {
                    fieldValue = this.wordProcessor.firstToUpper(this.customer_label) + ' id: ' + checkin.consumer.jaldeeId;
                } else {
                    fieldValue = this.wordProcessor.firstToUpper(this.customer_label) + ' id: ' + checkin.providerConsumer.jaldeeId;
                }
            }
        } else if (field.name === 'appxWaitingTime') {
            return this.dateTimeProcessor.providerConvertMinutesToHourMinute(checkin[field.name]);
        } else if (field.name === 'appointmentTime') {
            fieldValue = this.getSingleTime(checkin.appmtTime);
        } else if (field.name === 'service') {
            fieldValue = checkin[field.name].name;
        } else if (field.name === 'queue') {
            fieldValue = checkin[field.name].queueStartTime + ' - ' + checkin[field.name].queueEndTime;
        } else if (field.name === 'schedule') {
            fieldValue = checkin[field.name].apptSchedule.timeSlots[0].sTime + ' - ' + checkin[field.name].apptSchedule.timeSlots[0].eTime;
        } else if (field.label === true) {
            if (checkin.label[field.name]) {
                fieldValue = checkin.label[field.name];
            } else {
                fieldValue = field.defaultValue;
            }
        } else if (field.name === 'primaryMobileNo') {
            let full_phone = '';
            if (this.type === 'waitlist') {
                if (checkin['waitlistingFor'][0]['phoneNo'] && checkin['waitlistingFor'][0]['phoneNo'] !== 'null') {
                    full_phone = checkin['waitlistingFor'][0]['phoneNo'];
                }
            } else {
                if (checkin.phoneNumber) {
                    full_phone = checkin.phoneNumber;
                }
            }
            if (full_phone) {
                const phLength = full_phone.length;
                const tele = [];
                if (phLength === 10) {
                    for (let i = 0; i < phLength; i++) {
                        if (i < 6) {
                            tele[i] = full_phone[i].replace(/^\d+$/, '*');
                        } else {
                            tele[i] = full_phone[i];
                        }
                    }
                    for (let i = 0; i < phLength; i++) {
                        fieldValue += tele[i];
                    }
                }
            }
        } else if (field.name === 'label') {
            const labels = [];
            Object.keys(checkin.label).forEach(key => {
                labels.push(key);
            });
            fieldValue = labels.toString();
        } else {
            fieldValue = checkin[field.name];
        }
        return fieldValue;
    }
    setDisplayboards(element) {
        const displayboard = element.queueSet;
        this.selectedDisplayboards[element.position]['board'] = displayboard;
        const Mfilter = displayboard.queryString;
        if (this.type === 'waitlist') {
            this.provider_services.getTodayWaitlistFromStringQuery(Mfilter).subscribe(
                (waitlist: any) => {
                    const filteredList = waitlist.filter(wt => wt.service.serviceType === 'physicalService');
                    this.selectedDisplayboards[element.position]['checkins'] = filteredList;
                });
        } else {
            this.provider_services.getTodayAppointmentsFromStringQuery(Mfilter).subscribe(
                (waitlist: any) => {
                    const filteredList = waitlist.filter(wt => wt.service.serviceType === 'physicalService');
                    this.selectedDisplayboards[element.position]['checkins'] = filteredList;
                });
        }

    }
    createRange(number) {
        const items = [];
        for (let i = 0; i < number; i++) {
            items.push(i);
        }
        return items;
    }
}
