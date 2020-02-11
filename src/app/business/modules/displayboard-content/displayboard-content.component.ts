
import {interval as observableInterval,  Subscription, Observable } from 'rxjs';
import { Component, OnInit, HostListener, ViewChildren, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../shared/constants/project-constants';

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
    blogo;
    metricElement;
    cronHandle: Subscription;
    @ViewChildren('boardid') private boardstyle;
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
    constructor(private activated_route: ActivatedRoute,
        private provider_services: ProviderServices,
        private shared_services: SharedServices,
        private shared_functions: SharedFunctions) {
        this.onResize();
        this.activated_route.params.subscribe(
            qparams => {
                this.layout_id = qparams.id;
            });
        this.activated_route.queryParams.subscribe(
            queryparams => {
                this.type = queryparams.type;
            });
    }
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        const screenHeight = window.innerHeight;
        let hgt_reduced = 200;
        let fullhgt_reduced = 134;
        if (this.accountType === 'BRANCH_SP') {
            hgt_reduced = 320;
            fullhgt_reduced = 294;
        }
        this.fullHeight = screenHeight - fullhgt_reduced;
        if (this.boardRows > 1) {
            this.boardHeight = (screenHeight - hgt_reduced) / 2;
        } else {
            this.boardHeight = (screenHeight - hgt_reduced);
        }
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
        this.gets3curl();
        const MainBdetails = this.shared_functions.getitemFromGroupStorage('ynwbp', 'branch');
        if (MainBdetails) {
            this.MainBname = MainBdetails.bn || '';
            this.MainBlogo = MainBdetails.logo || '';
        }
        if (this.type) {
            this.provider_services.getDisplayboardContainer(this.layout_id).subscribe(
                (container: any) => {
                    this.inputStatusboards = container.sbContainer;
                    this.setTabIds().then(
                        (tabInfo: any) => {
                            this.api_loading = false;
                            this.accountType = 'BRANCH_SP';
                            this.shared_functions.setitemOnSessionStorage('tabSession', tabInfo);
                            this.getStatusboard(this.inputStatusboards[this.showIndex]);
                            this.cronHandle = observableInterval(container.interval * 1000).subscribe(() => {
                                if (this.showIndex === (this.inputStatusboards.length - 1)) {
                                    this.showIndex = 0;
                                } else {
                                    ++this.showIndex;
                                }
                                this.getStatusboard(this.inputStatusboards[this.showIndex]);
                            });
                        }
                    );
                });
        } else {
            this.cronHandle = observableInterval(20000).subscribe(() => {
                this.getSingleStatusboard();
            });
        }
    }
    getSingleStatusboard() {
        this.provider_services.getBussinessProfile().subscribe(
            (bProfile: any) => {
                this.provider_services.getProviderLogo().subscribe(
                    data => {
                        const blogo = data;
                        let logo = '';
                        if (blogo[0]) {
                            logo = blogo[0].url;
                        } else {
                            logo = '';
                        }
                        let subsectorname = '';
                        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
                        this.accountType = user.accountType;
                        if (bProfile && bProfile.subDomainVirtualFields) {
                            if (bProfile['serviceSector'] && bProfile['serviceSector']['domain']) {
                                // calling function which saves the business related details to show in the header
                                subsectorname = this.shared_functions.retSubSectorNameifRequired(bProfile['serviceSector']['domain'], bProfile['serviceSubSector']['displayName']);
                                // calling function which saves the business related details to show in the header
                            }
                            const virtualfields = bProfile.subDomainVirtualFields[0][user.subSector];
                            this.provider_services.getVirtualFields(user.sector, user.subSector).subscribe(
                                (data1: any) => {
                                    this.subDomVirtualFields = data1;
                                    for (let i = 0; i < this.subDomVirtualFields.length; i++) {
                                        if (this.subDomVirtualFields[i].baseField === 'qualification') {
                                            const eduName = this.subDomVirtualFields[i]['name'];
                                            this.qualification = virtualfields[eduName];
                                        }
                                    }
                                });
                        }
                        this.shared_functions.setBusinessDetailsforHeaderDisp(bProfile['businessName']
                            || '', bProfile['serviceSector']['displayName'] || '', subsectorname || '', logo);
                        this.getBusinessdetFromLocalstorage();
                        // this.gets3curl();
                        let UTCstring = null;
                        UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
                        this.shared_services.getbusinessprofiledetails_json(bProfile.uniqueId, this.s3Url, 'businessProfile', UTCstring)
                            .subscribe((businessJson: any) => {
                                this.businessJson = businessJson;
                                this.api_loading = false;
                            });
                    });
            });
        if (this.layout_id) {
            let layoutData;
            this.provider_services.getDisplayboard(this.layout_id).subscribe(
                layoutInfo => {
                    layoutData = layoutInfo;
                    this.roomName = layoutData['serviceRoom'];
                    const layoutPosition = layoutData.layout.split('_');
                    this.boardRows = layoutPosition[0];
                    this.onResize();
                    this.boardCols = layoutPosition[1];
                    layoutData.metric.forEach(element => {
                        this.metricElement = element;
                        this.selectedDisplayboards[element.position] = {};
                        this.setDisplayboards(this.metricElement);
                    });
                });
        }
    }
    gets3curl() {
        this.shared_functions.getS3Url('provider')
            .then(
                res => {
                    this.s3Url = res;
                }
            );
    }
    getbusinessprofiledetails_json(url, section, modDateReq: boolean) {
        let UTCstring = null;
        if (modDateReq) {
            UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
        }
        this.shared_services.getbusinessprofiledetails_json(this.provider_id, url, section, UTCstring)
            .subscribe(res => {
                this.businessJson = res;
            });
    }

    setTabId(accountId) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.provider_services.manageProvider(accountId).subscribe(
                (data: any) => {
                    const dispcont = {};
                    _this.tabid[accountId] = data.tabId;
                    _this.shared_functions.setitemOnSessionStorage('accountid', accountId);
                    _this.shared_functions.setitemOnSessionStorage('tabId', data.tabId);
                    data['accountType'] = 'BRANCH_SP';
                    _this.shared_functions.setitemToGroupStorage('ynw-user', data);
                    _this.shared_functions.setitemonLocalStorage('tabIds', _this.tabid);
                    _this.provider_services.getBussinessProfile().subscribe(
                        (bProfile: any) => {
                            _this.provider_services.getProviderLogo().subscribe(
                                (logoinfo: any) => {
                                    const blogo = logoinfo;
                                    let logo = '';
                                    if (blogo[0]) { logo = blogo[0].url; } else { logo = ''; }
                                    dispcont['logo'] = logo;
                                    dispcont['businessName'] = bProfile['businessName'];
                                });
                            let UTCstring = null;
                            UTCstring = _this.shared_functions.getCurrentUTCdatetimestring();
                            _this.shared_services.getbusinessprofiledetails_json(bProfile.uniqueId, _this.s3Url, 'businessProfile', UTCstring)
                                .subscribe((businessJson: any) => {
                                    dispcont['businessJson'] = businessJson;
                                    if (bProfile && bProfile.subDomainVirtualFields) {
                                        const user = _this.shared_functions.getitemFromGroupStorage('ynw-user');
                                        const virtualfields = bProfile.subDomainVirtualFields[0][user.subSector];
                                        _this.provider_services.getVirtualFields(user.sector, user.subSector).subscribe(data => {
                                            _this.subDomVirtualFields = data;
                                            for (let i = 0; i < _this.subDomVirtualFields.length; i++) {
                                                if (_this.subDomVirtualFields[i].baseField === 'qualification') {
                                                    const eduName = _this.subDomVirtualFields[i]['name'];
                                                    dispcont['qualification'] = virtualfields[eduName];
                                                }
                                            }
                                            resolve(dispcont);
                                        });
                                    } else {
                                        resolve(dispcont);
                                    }
                                });
                        });
                });
        });
    }
    setTabIds() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            const tabInfo = {};
            let count = 0;
            // countOfProviders
            const processList = [];
            const intervalCall = setInterval(() => {
                const accountId = _this.inputStatusboards[count].providerId;
                if (processList.indexOf(accountId) === -1) {
                    processList.push(accountId);
                    _this.setTabId(accountId).then(
                        (data: any) => {
                            tabInfo[accountId] = data;
                            if (count === (_this.inputStatusboards.length - 1)) {
                                clearInterval(intervalCall);
                                resolve(tabInfo);
                            } else {
                                ++count;
                            }
                        });
                } else if (tabInfo[accountId]) {
                    if (count === (_this.inputStatusboards.length - 1)) {
                        clearInterval(intervalCall);
                        resolve(tabInfo);
                    }
                    ++count;
                }
            }, (1000));
        });
    }
    getStatusboard(boardObj) {
        const tabIds = this.shared_functions.getitemfromLocalStorage('tabIds');
        if (tabIds[boardObj['providerId']]) {
            this.shared_functions.setitemOnSessionStorage('tabId', tabIds[boardObj['providerId']]);
            this.shared_functions.setitemOnSessionStorage('accountid', boardObj['providerId']);
        }
        if (boardObj.sbId) {
            let layoutData;
            this.roomName = '';
            this.blogo = '';
            this.qualification = '';
            this.bname = '';
            const accountId = this.shared_functions.getitemfromSessionStorage('accountid');
            const tabSession = this.shared_functions.getitemfromSessionStorage('tabSession');
            const accountInfo = tabSession[accountId];
            this.businessJson = accountInfo.businessJson;
            if (accountInfo.qualification) {
                this.qualification = accountInfo.qualification;
            }
            if (accountInfo.logo) {
                this.blogo = accountInfo.logo;
            }
            this.bname = accountInfo.businessName;
            this.provider_services.getDisplayboard(boardObj.sbId).subscribe(
                layoutInfo => {
                    layoutData = layoutInfo;
                    this.roomName = layoutData['serviceRoom'];
                    const layoutPosition = layoutData.layout.split('_');
                    this.boardRows = layoutPosition[0];
                    this.onResize();
                    this.boardCols = layoutPosition[1];
                    layoutData.metric.forEach(element => {
                        this.metricElement = element;
                        this.selectedDisplayboards[element.position] = {};
                        this.setDisplayboards(this.metricElement);
                    });
                });
        }
    }
    getBusinessdetFromLocalstorage() {
        const MainBdetails = this.shared_functions.getitemFromGroupStorage('ynwbp', 'branch');
        const bdetails = this.shared_functions.getitemFromGroupStorage('ynwbp');
        if (bdetails) {
            this.bname = bdetails.bn || '';
            this.blogo = bdetails.logo || '';
        }
        if (MainBdetails) {
            this.MainBname = MainBdetails.bn || '';
            this.MainBlogo = MainBdetails.logo || '';
        }
    }
    getFieldValue(field, checkin) {
        let fieldValue = '';
        if (field.name === 'waitlistingFor') {
            const lastName = checkin[field.name][0].lastName;
            const nameLength = lastName.length;
            const encryptedName = [];
            let lastname = '';
            for (let i = 0; i < nameLength; i++) {
                encryptedName[i] = lastName[i].replace(/./g, '*');
            }
            for (let i = 0; i < nameLength; i++) {
                lastname += encryptedName[i];

            }
            fieldValue = checkin[field.name][0].firstName + ' ' + lastname;
        } else if (field.name === 'appxWaitingTime') {
            return this.shared_functions.providerConvertMinutesToHourMinute(checkin[field.name]);
        } else if (field.name === 'service') {
            fieldValue = checkin[field.name].name;
        } else if (field.name === 'queue') {
            fieldValue = checkin[field.name].queueStartTime + ' - ' + checkin[field.name].queueEndTime;
        } else if (field.label === true) {
            if (checkin.label[field.name]) {
                fieldValue = checkin.label[field.name];
            } else {
                fieldValue = field.defaultValue;
            }
        } else if (field.name === 'primaryMobileNo') {
            const full_phone = checkin['waitlistingFor'][0]['primaryMobileNo'];
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
        } else {
            fieldValue = checkin[field.name];
        }
        return fieldValue;
    }
    setDisplayboards(element) {
        const displayboard = element.queueSet;
        // this.provider_services.getDisplayboardQSetbyId(element.sbId).subscribe(
        //     (displayboard) => {
        const fieldlistasc = this.shared_functions.sortByKey(displayboard.fieldList, 'order');
        displayboard.fieldList = fieldlistasc;
        this.selectedDisplayboards[element.position]['board'] = displayboard;
        const Mfilter = this.setFilterForApi(displayboard);
        Object.keys(displayboard['sortBy']).forEach(key => {
            Mfilter[key] = displayboard['sortBy'][key];
        });
        this.provider_services.getTodayWaitlist(Mfilter).subscribe(
            (waitlist) => {
                this.selectedDisplayboards[element.position]['checkins'] = waitlist;
            });
        // });
    }
    createRange(number) {
        const items = [];
        for (let i = 0; i < number; i++) {
            items.push(i);
        }
        return items;
    }
    setFilterForApi(layout) {
        const api_filter = {};
        //    api_filter['location-eq'] = this.locId;
        layout.queueSetFor.forEach(element => {
            if (element.type === 'SERVICE') {
                api_filter['service-eq'] = element.id;
            } else if (element.type === 'QUEUE') {
                api_filter['queue-eq'] = element.id;
            } else {
                api_filter['department-eq'] = element.id;
            }
            api_filter['waitlistStatus-eq'] = 'arrived,checkedIn';
        });
        return api_filter;
    }
}
